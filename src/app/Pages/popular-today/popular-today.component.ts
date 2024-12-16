import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IconComponent } from '../../Components/Shared/icon/icon.component';
import { ConfirmDeleteDialogComponent } from '../../Components/Dialogs/confirm-delete-dialog/confirm-delete-dialog.component';
import { IItem } from '../../Models/item';
import { AfterActionService } from '../../Services/AfterAction/after-action.service';
import { PopularTodayDialogComponent } from "../../Components/Dialogs/popular-today-dialog/popular-today-dialog.component";
import { PopularTodayService } from '../../Services/PopularToday/popular-today.service';
import { BreadcrumbComponent } from '../../Components/Shared/breadcrumb/breadcrumb.component';
import { PaginationComponent } from '../../Components/Shared/pagination/pagination.component';
import { ExportService } from '../../Services/Export/export.service';

@Component({
  selector: 'app-popular-today',
  standalone: true,
  imports: [CommonModule, IconComponent, ReactiveFormsModule, FormsModule, PopularTodayDialogComponent, RouterModule, ConfirmDeleteDialogComponent, PopularTodayDialogComponent, BreadcrumbComponent, PaginationComponent],
  templateUrl: './popular-today.component.html',
  styleUrl: './popular-today.component.scss'
})
export class PopularTodayComponent implements OnInit {
  isFilterVisible: boolean = false;
  isModalOpen: boolean = false;
  isMenuOpen: boolean = false;
  items: IItem[] = [];
  selectedItem: IItem | null = null;
  currentPage: number = 1;
  totalPages: number = 4;
  isConfirmDeleteModalOpen: boolean = false;
  ItemToDeleteId!: number;

  itemTypes = ['Perishable', 'Non-Perishable'];
  features = ['Yes', 'No'];
  statuses = ['Active', 'Inactive'];

  headers: string[] = ['Name', 'Category', 'PreviousPrice', 'CurrentPrice', 'Status'];
  tableData: { Name: string; Category: string; PreviousPrice: number; CurrentPrice: number, Status: boolean }[] = [];

  constructor(
    private popularTodayService: PopularTodayService,
    private afterActionService: AfterActionService,
    private elementRef: ElementRef,
    private exportService: ExportService
  ) { }

  ngOnInit() {
    this.loadItems();
  }

  loadItems(): void {
    const storedBranch = JSON.parse(localStorage.getItem('selectedBranch') || '{}');
    const branchId = storedBranch.id || null;

    // Fetching filtered items from the service
    this.popularTodayService.filterPopularItems(
      undefined, // name (optional)
      undefined, // prePrice (optional)
      undefined, // currentPrice (optional)
      undefined, // description (optional)
      undefined, // itemId (optional)
      branchId, // branchId
      undefined, // categoryName (optional)
      undefined, // createdAtStart (optional)
      undefined, // createdAtEnd (optional)
      undefined, // isDeleted (optional)
      this.currentPage, // pageNumber
      10 // pageSize
    ).subscribe(
      (response) => {
        this.items = response.data;
        this.totalPages = Math.ceil(response.totalcount / 10);

        this.tableData = this.items.map(item => ({
          Name: item.name,
          Category: item.categoryName,
          PreviousPrice: item.prePrice ?? 0,
          CurrentPrice: item.price,
          Status: item.isActive
        }));

        console.log('Items loaded:', response);
      },
      (error) => {
        console.error('Error loading items:', error);
      }
    );
  }

  openConfirmDeleteModal(id: number) {
    this.ItemToDeleteId = id;
    this.isConfirmDeleteModalOpen = true;
  }

  deleteItem(): void {
    if (this.ItemToDeleteId) {
      this.popularTodayService.deletePopularItem(this.ItemToDeleteId).subscribe((response) => {
        console.log(`Item with id ${this.ItemToDeleteId} deleted successfully.`, response);
        this.afterActionService.reloadCurrentRoute();
      }, (error) => {
        console.error(`Error deleting item with id ${this.ItemToDeleteId}:`, error);
      });
    }
  }

  openModal(action: string, item: IItem | null) {
    this.selectedItem = item;
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  exportXLS() {
    this.exportService.exportTableToXls(this.tableData, this.headers, 'PopularItemsData');
    this.isMenuOpen = false;
  }

  print() {
    this.exportService.exportTableToPdf(this.tableData, this.headers, 'PopularItemsData');
    this.isMenuOpen = false;
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    const clickedInside = this.elementRef.nativeElement.contains(event.target);
    if (!clickedInside) {
      this.isMenuOpen = false;
    }
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadItems();
  }
}
