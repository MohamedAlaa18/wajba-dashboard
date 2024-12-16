import { CommonModule } from '@angular/common';
import { Component, AfterViewInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { GoogleMap } from '@angular/google-maps';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [GoogleMap, CommonModule,ReactiveFormsModule],
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements AfterViewInit {
  @ViewChild(GoogleMap, { static: false }) map!: GoogleMap;

  center: google.maps.LatLngLiteral = {
    lat: 25.276987,
    lng: 51.520008
  };
  zoom = 12;
  marker: google.maps.Marker | undefined;
  mapForm: FormGroup;
  locationSelected = false;

  constructor(private fb: FormBuilder) {
    this.mapForm = this.fb.group({
      location: [null, Validators.required]  // Add validators here
    });
  }

  ngAfterViewInit() {
    if (this.map?.googleMap) {
      const mapOptions: google.maps.MapOptions = {
        center: this.center,
        zoom: this.zoom,
        disableDefaultUI: true,
        zoomControl: true,
        streetViewControl: false,
        mapTypeControl: false,
        scaleControl: false,
        rotateControl: false,
        fullscreenControl: false,
      };

      this.map.googleMap.setOptions(mapOptions);

      const geolocationButton = this.createGeolocationButton();
      this.map.googleMap.controls[google.maps.ControlPosition.TOP_RIGHT].push(geolocationButton);

      this.map.googleMap.addListener('click', (event: google.maps.MapMouseEvent) => this.handleMapClick(event));
    }
  }

  detectLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos: google.maps.LatLngLiteral = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          this.setMapLocation(pos, 'You are here');
        },
        (error) => {
          console.error('Error getting location', error);
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  }

  zoomIn() {
    if (this.map?.googleMap) {
      this.zoom = Math.min(this.zoom + 1, 21); // Max zoom level 21
      this.map.googleMap.setZoom(this.zoom);
    }
  }

  zoomOut() {
    if (this.map?.googleMap) {
      this.zoom = Math.max(this.zoom - 1, 0); // Min zoom level 0
      this.map.googleMap.setZoom(this.zoom);
    }
  }

  createGeolocationButton(): HTMLButtonElement {
    const button = document.createElement('button');
    button.classList.add('geolocation-button');
    button.title = 'Detect your current location';

    button.addEventListener('click', () => this.detectLocation());

    return button;
  }

  setMapLocation(location: google.maps.LatLngLiteral, title: string) {
    this.center = location;
    if (this.map?.googleMap) {
      this.map.googleMap.setCenter(this.center);
      this.zoom = 15;

      if (this.marker) {
        this.marker.setMap(null);
      }

      this.marker = new google.maps.Marker({
        position: this.center,
        map: this.map.googleMap,
        title: title
      });

      this.getAddressFromCoordinates(location);
    }
  }

  getAddressFromCoordinates(location: google.maps.LatLngLiteral) {
    const geocoder = new google.maps.Geocoder();

    geocoder.geocode({ location }, (results, status) => {
      if (status === 'OK' && results && results[0]) {
        let humanReadableAddress = results[0].formatted_address;

        // Optional: Filter address components if needed
        const filteredComponents = results[0].address_components.filter(component => {
          return !component.types.includes('plus_code') && !component.types.includes('postal_code');
        });

        if (filteredComponents.length > 0) {
          humanReadableAddress = filteredComponents.map(component => component.long_name).join(', ');
        }

        // Update input field and form control
        this.mapForm.patchValue({
          location: humanReadableAddress
        });
      } else {
        console.error('Geocoder failed due to: ' + status);

        // Handle case where no address was found
        this.mapForm.patchValue({
          location: `Lat: ${location.lat}, Lng: ${location.lng}`
        });
      }
    });
  }

  handleMapClick(event: google.maps.MapMouseEvent) {
    if (event.latLng) {
      const clickedLocation: google.maps.LatLngLiteral = {
        lat: event.latLng.lat(),
        lng: event.latLng.lng()
      };
      this.setMapLocation(clickedLocation, 'Selected location');
    }
  }
}
