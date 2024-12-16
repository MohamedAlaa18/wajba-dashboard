import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { IconComponent } from '../../Components/Shared/icon/icon.component';
import { UserDialogComponent } from '../../Components/Dialogs/user-dialog/user-dialog.component';
import { SubscriberDialogComponent } from '../../Components/Dialogs/subscriber-dialog/subscriber-dialog.component';
import { TableComponent } from '../../Components/table/table.component';
import { FilterFormComponent } from '../../Components/filter-form/filter-form.component';

@Component({
  selector: 'app-credit-balance-report',
  standalone: true,
  imports: [
    CommonModule,
    IconComponent,
    ReactiveFormsModule,
    FormsModule,
    UserDialogComponent,
    RouterModule,
    SubscriberDialogComponent,
    TableComponent,
    FilterFormComponent
  ],
  templateUrl: './credit-balance-report.component.html',
  styleUrl: './credit-balance-report.component.scss'
})
export class CreditBalanceReportComponent implements OnInit {
  isFilterVisible: boolean = false;
  isMenuOpen: boolean = false;

  // Transactions sample data
  transactions = [
    { id: '682-657', name: 'Tracy Ritchie', email: 'Trycia67@gmail.com', phone: '639-333-1748', role: 'Admin' },
    { id: '682-657', name: 'Tricia Douglas', email: 'Orlando8@hotmail.com', phone: '407-324-3227', role: 'User' }
  ];

  filters = {
    name: '',
    email: '',
    phone: '',
    role: ''
  };

  // Dropdown options for roles
  roleOptions = ['Admin', 'User', 'Moderator'];

  // Filter fields
  filterFields = [
    { label: 'Name', name: 'name', type: 'text' },
    { label: 'Email', name: 'email', type: 'text' },
    { label: 'Phone', name: 'phone', type: 'text' },
    { label: 'Role', name: 'role', type: 'select', options: this.roleOptions }
  ];

  headers = ['Name', 'Email', 'Phone', 'Role'];
  rows: any[][] = [];

  constructor(private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    // Populate the rows for the table
    this.rows = this.transactions.map(t => [t.name, t.email, t.phone, t.role]);
  }

  applyFilters(filters: any) {
    // Implement filter logic here (e.g., filter the transactions list)
    console.log('Filters applied:', filters);
  }

  clearFilters() {
    this.filters = {
      name: '',
      email: '',
      phone: '',
      role: ''
    };
    this.applyFilters(this.filters);
  }

  toggleFilterVisibility() {
    this.isFilterVisible = !this.isFilterVisible;
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  exportXLS() {
    console.log('Exporting as XLS...');
    this.isMenuOpen = false;
  }

  print() {
    console.log('Printing...');
    this.isMenuOpen = false;
  }
}
