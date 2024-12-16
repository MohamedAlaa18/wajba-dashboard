import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { IconComponent } from '../../Components/Shared/icon/icon.component';
import { UserDialogComponent } from '../../Components/Dialogs/user-dialog/user-dialog.component';
import { SubscriberDialogComponent } from '../../Components/Dialogs/subscriber-dialog/subscriber-dialog.component';
import { ITransaction } from '../../Models/itransaction';
import { TableComponent } from '../../Components/table/table.component';
import { FilterFormComponent } from '../../Components/filter-form/filter-form.component';

@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [CommonModule, IconComponent, ReactiveFormsModule, FormsModule, UserDialogComponent, RouterModule, SubscriberDialogComponent, TableComponent, FilterFormComponent],
  templateUrl: './transactions.component.html',
  styleUrl: './transactions.component.scss'
})
export class TransactionsComponent implements OnInit {
  isFilterVisible: boolean = false;
  isMenuOpen: boolean = false;

  transactions: ITransaction[] = [
    { id: '682-657-3396', date: '02:30pm,15-3-2025', paymentMethod: 'Cash on delivery', orderNo: '382-815-8971', amount: 700 },
    { id: '682-657-3396', date: '02:30pm,15-3-2025', paymentMethod: 'Bank card', orderNo: '436-565-2128', amount: 700 },
  ];

  filters = {
    transactionId: '',
    orderSerialNo: '',
    paymentMethod: '',
    date: '',
  };

  paymentMethodOptions = ['Cash on delivery', 'Bank card', 'Online payment'];

  filterFields = [
    { label: 'Transaction ID', name: 'transactionId', type: 'text' },
    { label: 'Order Serial No', name: 'orderSerialNo', type: 'text' },
    { label: 'Payment Method', name: 'paymentMethod', type: 'select', options: this.paymentMethodOptions },
    { label: 'Date', name: 'date', type: 'date' }
  ];

  headers = ['Transactions ID', 'Date', 'Payment Method', 'Order No.', 'Amount'];
  rows: any[][] = [];

  constructor(private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.rows = this.transactions.map(t => [t.id, t.date, t.paymentMethod, t.orderNo, `QAR ${t.amount}`]);
  }

  applyFilters(filters: any) {
    // Implement the filter logic here
  }

  clearFilters() {
    this.filters = {
      transactionId: '',
      orderSerialNo: '',
      paymentMethod: '',
      date: '',
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
