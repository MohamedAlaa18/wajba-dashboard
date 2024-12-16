import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { IconComponent } from '../../Components/Shared/icon/icon.component';
import { UserDialogComponent } from '../../Components/Dialogs/user-dialog/user-dialog.component';
import { SubscriberDialogComponent } from '../../Components/Dialogs/subscriber-dialog/subscriber-dialog.component';
import { TableComponent } from '../../Components/table/table.component';
import { FilterFormComponent } from '../../Components/filter-form/filter-form.component';
import { IItemReport } from '../../Models/Ireport';


@Component({
  selector: 'app-item-reports',
  standalone: true,
  imports: [CommonModule, IconComponent, ReactiveFormsModule, FormsModule, UserDialogComponent, RouterModule, SubscriberDialogComponent, TableComponent, FilterFormComponent],
  templateUrl: './item-reports.component.html',
  styleUrl: './item-reports.component.scss'
})
export class ItemReportsComponent {
  isFilterVisible: boolean = false;
  isMenuOpen: boolean = false;

  transactions: IItemReport[] = [
    { id: '682-657', name: 'Alfredo', category: 'Pasta', type: 'Non- Veg', quantity: 12 },
    { id: '682-657', name: 'Chiken ransh', category: 'Pizza', type: 'Veg', quantity: 5 },
  ];

  filters = {
    orderSerialNo: '',
    status: '',
    paymentMethod: '',
    source: '',
    date: '',
    paidStatus: '',
    deliveryBoy: ''
  };

  // Dropdown options
  statusOptions = ['Pending', 'Completed', 'Cancelled'];
  paymentMethodOptions = ['Cash on delivery', 'Bank card', 'Online payment'];
  sourceOptions = ['Online', 'In-store'];
  paidStatusOptions = ['Paid', 'Unpaid'];
  deliveryBoyOptions = ['John Doe', 'Jane Smith', 'Mike Johnson'];

  filterFields = [
    { label: 'Order Serial No', name: 'orderSerialNo', type: 'text' },
    { label: 'Status', name: 'status', type: 'select', options: this.statusOptions },
    { label: 'Payment Method', name: 'paymentMethod', type: 'select', options: this.paymentMethodOptions },
    { label: 'Source', name: 'source', type: 'select', options: this.sourceOptions },
    { label: 'Date', name: 'date', type: 'date' },
    { label: 'Paid Status', name: 'paidStatus', type: 'select', options: this.paidStatusOptions },
    { label: 'Delivery Boy', name: 'deliveryBoy', type: 'select', options: this.deliveryBoyOptions },
  ];

  headers = ['Order ID', 'Date', 'Total', 'Discount', 'Delivery charge', 'Payment Type', 'Payment Status'];
  rows: any[][] = [];

  constructor(private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.rows = this.transactions.map(t => [t.id, t.name, t.category, t.type, t.quantity]);
  }

  applyFilters(filters: any) {
    // Implement the filter logic here
    console.log('Filters applied:', filters);
  }

  clearFilters() {
    this.filters = {
      orderSerialNo: '',
      status: '',
      paymentMethod: '',
      source: '',
      date: '',
      paidStatus: '',
      deliveryBoy: ''
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
