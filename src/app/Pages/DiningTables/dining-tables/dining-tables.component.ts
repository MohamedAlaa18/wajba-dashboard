import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IconComponent } from '../../../Components/Shared/icon/icon.component';
import { IDiningTable } from '../../../Models/itable';
import { TablesDialogComponent } from '../../../Components/Dialogs/tables-dailog/tables-dialog.component';
import { DiningTableService } from '../../../Services/DiningTable/dining-table.service';
import { AfterActionService } from '../../../Services/AfterAction/after-action.service';
import { ConfirmDeleteDialogComponent } from '../../../Components/Dialogs/confirm-delete-dialog/confirm-delete-dialog.component';
import { BreadcrumbComponent } from '../../../Components/Shared/breadcrumb/breadcrumb.component';
import { PaginationComponent } from '../../../Components/Shared/pagination/pagination.component';

@Component({
  selector: 'app-dining-tables',
  standalone: true,
  imports: [CommonModule, IconComponent, ReactiveFormsModule, FormsModule, TablesDialogComponent, RouterModule, ConfirmDeleteDialogComponent, BreadcrumbComponent, PaginationComponent],
  templateUrl: './dining-tables.component.html',
  styleUrls: ['./dining-tables.component.scss']
})
export class DiningTablesComponent implements OnInit {
  isFilterVisible: boolean = false;
  isModalOpen: boolean = false;
  isMenuOpen: boolean = false;
  filteredTable: IDiningTable[] = [];
  tables: IDiningTable[] = [];
  selectedTable: IDiningTable | null = null;

  isConfirmDeleteModalOpen: boolean = false;
  ItemToDeleteId!: number;

  currentPage: number = 1;
  totalPages: number = 4;

  filters = {
    name: '',
    size: '',
    status: ''
  };

  statuses = ['Active', 'Inactive'];

  constructor(
    private diningTableService: DiningTableService,
    private afterActionService: AfterActionService,
    private elementRef: ElementRef
  ) { }

  ngOnInit() {
    this.fetchDiningTables();
  }

  fetchDiningTables(pageSize: number = 10) {
    this.diningTableService.filterDiningTables(
      this.filters.name,
      this.filters.size ? +this.filters.size : undefined,
      this.filters.status === 'Active' ? true : (this.filters.status === 'Inactive' ? false : undefined),
      undefined,
      this.currentPage,
      pageSize
    ).subscribe((response: any) => {
      this.tables = response.data;
      this.filteredTable = this.tables;
      this.totalPages = Math.ceil(response.totalcount / pageSize);
      console.log(response)
    }, (error) => {
      console.error('Error fetching dining tables:', error);
    });
  }

  applyFilters() {
    this.fetchDiningTables();
  }

  toggleFilterVisibility() {
    this.isFilterVisible = !this.isFilterVisible;
  }

  openModal(action: string, table: IDiningTable | null) {
    this.selectedTable = table;
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
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

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    const clickedInside = this.elementRef.nativeElement.contains(event.target);
    if (!clickedInside) {
      this.isMenuOpen = false;
    }
  }

  clearFilters() {
    this.filters = {
      name: '',
      size: '',
      status: ''
    };
    this.applyFilters();
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.fetchDiningTables();
  }

  openConfirmDeleteModal(id: number) {
    this.ItemToDeleteId = id;
    this.isConfirmDeleteModalOpen = true;
  }

  deleteItem(): void {
    if (this.ItemToDeleteId) {
      this.diningTableService.deleteDiningTable(this.ItemToDeleteId).subscribe((response) => {
        console.log(`Item with id ${this.ItemToDeleteId} deleted successfully.`, response);
        this.afterActionService.reloadCurrentRoute();
      }, (error) => {
        console.error(`Error deleting item with id ${this.ItemToDeleteId}:`, error);
      });
    }
  }

  downloadQRCode(table: IDiningTable) {
    if (table?.qrCode) {
      const qrCodeDataUrl = table.qrCode;

      // Create a link element
      const link = document.createElement('a');

      // Set the href to the QR code data URL
      link.href = qrCodeDataUrl;

      // Set the download attribute with a default filename
      link.download = `QRCode-${table.id}.svg`;

      // Append the link to the body (required for Firefox)
      document.body.appendChild(link);

      // Programmatically click the link to trigger the download
      link.click();

      // Remove the link from the DOM
      document.body.removeChild(link);
    } else {
      console.error('No QR code available for download.');
    }
  }
}
