import { Component, EventEmitter, Output, AfterViewInit } from '@angular/core';
import { IconComponent } from '../../Shared/icon/icon.component';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-map-dialog',
  imports: [IconComponent, ReactiveFormsModule],
  standalone: true,
  templateUrl: './map-dialog.component.html',
  styleUrls: ['./map-dialog.component.scss']
})
export class MapDialogComponent implements AfterViewInit {
  @Output() coordinatesSelected = new EventEmitter<{ longitude: number; latitude: number }>();
  @Output() close = new EventEmitter<void>();

  longitude: number = 0;
  latitude: number = 0;
  map: google.maps.Map | undefined;
  searchForm: FormGroup;
  marker: google.maps.Marker | undefined;
  autocomplete: google.maps.places.Autocomplete | undefined;

  constructor(private fb: FormBuilder) {
    this.searchForm = this.fb.group({
      search: ['']
    });
  }

  ngAfterViewInit() {
    this.initMap();
    this.initAutocomplete();
  }

  // Initialize Google Map
  initMap() {
    this.map = new google.maps.Map(document.getElementById('map') as HTMLElement, {
      center: { lat: -34.397, lng: 150.644 },
      zoom: 8,
      mapTypeControl: false,
    });

    // Add a marker when clicking on the map
    this.map.addListener('click', (event: google.maps.MapMouseEvent) => {
      if (event.latLng) {
        this.updateMarker(event.latLng);
        this.longitude = event.latLng.lng();
        this.latitude = event.latLng.lat();
      }
    });

    // Handle double-click event to set coordinates and close modal
    this.map.addListener('dblclick', (event: google.maps.MapMouseEvent) => {
      if (event.latLng) {
        const latLng = event.latLng;
        this.longitude = latLng.lng();
        this.latitude = latLng.lat();
        this.coordinatesSelected.emit({ longitude: this.longitude, latitude: this.latitude });
        this.close.emit(); // Close the modal
      }
    });
  }

  // Initialize Google Places Autocomplete
  initAutocomplete() {
    const input = document.querySelector('input[formControlName="search"]') as HTMLInputElement;
    this.autocomplete = new google.maps.places.Autocomplete(input);

    // Add listener to update map when a place is selected
    this.autocomplete.addListener('place_changed', () => {
      const place = this.autocomplete?.getPlace();
      if (place?.geometry?.location) {
        const location = place.geometry.location;
        this.updateMarker(location);
        this.map?.setCenter(location);
        this.longitude = location.lng();
        this.latitude = location.lat();
      }
    });
  }

  // Update the marker position
  updateMarker(location: google.maps.LatLng) {
    if (this.marker) {
      this.marker.setPosition(location);
    } else {
      this.marker = new google.maps.Marker({
        position: location,
        map: this.map,
        title: 'Selected Location',
      });
    }
    this.map?.setCenter(location); // Center the map on the selected location
  }

  // Get current location and center map on it
  goToCurrentLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        const location = new google.maps.LatLng(latitude, longitude);
        this.updateMarker(location);
        this.map?.setCenter(location);
        this.longitude = longitude;
        this.latitude = latitude;
      });
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  }

  closeModal() {
    this.close.emit();
  }
}
