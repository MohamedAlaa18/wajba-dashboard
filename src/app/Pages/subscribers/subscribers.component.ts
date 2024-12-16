import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { IconComponent } from '../../Components/Shared/icon/icon.component';
import { UserDialogComponent } from '../../Components/Dialogs/user-dialog/user-dialog.component';
import { ISubscriber } from '../../Models/isubscriber';
import { SubscriberDialogComponent } from '../../Components/Dialogs/subscriber-dialog/subscriber-dialog.component';

@Component({
  selector: 'app-subscribers',
  standalone: true,
  imports: [CommonModule, IconComponent, ReactiveFormsModule, FormsModule, UserDialogComponent, RouterModule, SubscriberDialogComponent],
  templateUrl: './subscribers.component.html',
  styleUrl: './subscribers.component.scss'
})
export class SubscribersComponent implements OnInit {
  isFilterVisible: boolean = false;
  isModalOpen: boolean = false;
  isMenuOpen: boolean = false;
  filteredSubscribers: ISubscriber[] = [];
  subscribers: ISubscriber[] = [];
  selectedSubscriber: ISubscriber | null = null;
  subscriberTypeLabel: string = '';

  filters = {
    email: '',
    phone: '',
    date: '',
  };

  subscriber: ISubscriber[] = [
    { id: '1', email: 'email@mail.com', phone: 10203040, date: '2024-08-12' },
    { id: '2', email: 'email@mail.com', phone: 10203040, date: '2024-08-10' },
  ];

  constructor(private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    // Subscribe to route changes and adjust users based on the path
    this.route.url.subscribe((urlSegments) => {
      const path = urlSegments[0]?.path;

      switch (path) {
        case 'subscribers':
          this.subscribers = this.subscriber;
          this.subscriberTypeLabel = 'Subscribers';
          break;
      }
    });
  }

  applyFilters() {
    // Filter logic to be implemented
  }

  toggleFilterVisibility() {
    this.isFilterVisible = !this.isFilterVisible;
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  exportXLS() {
    console.log('Exporting as XLS...');
    this.isMenuOpen = false; // Close the menu after selection
  }

  print() {
    console.log('Printing...');
    this.isMenuOpen = false; // Close the menu after selection
  }

  deleteSubscriber(id: string) { }

  clearFilters() {
    this.filters = {
      email: '',
      phone: '',
      date: '',
    };
    this.applyFilters(); // Clear filters and refresh the view
  }

  openModal(action: string, subscriber: ISubscriber | null) {
    this.selectedSubscriber = subscriber;
    this.isModalOpen = true;
  }
}
