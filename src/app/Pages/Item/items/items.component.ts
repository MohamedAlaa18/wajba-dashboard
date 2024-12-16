import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IItem } from '../../../Models/item';
import { ItemsService } from '../../../Services/Items/items.service';
import { AfterActionService } from '../../../Services/AfterAction/after-action.service';
import { IconComponent } from '../../../Components/Shared/icon/icon.component';
import { ItemDialogComponent } from '../../../Components/Dialogs/item-dialog/item-dialog.component';
import { ITax } from '../../../Models/itax';
import { ICategoryItem } from '../../../Models/category-item';
import { CategoryService } from '../../../Services/Category/category.service';
import { TaxService } from '../../../Services/Tax/tax.service';
import { ConfirmDeleteDialogComponent } from '../../../Components/Dialogs/confirm-delete-dialog/confirm-delete-dialog.component';
import { BreadcrumbComponent } from '../../../Components/Shared/breadcrumb/breadcrumb.component';
import { PaginationComponent } from '../../../Components/Shared/pagination/pagination.component';
import { ExportService } from '../../../Services/Export/export.service';

@Component({
  selector: 'app-items',
  standalone: true,
  imports: [CommonModule, IconComponent, ReactiveFormsModule, FormsModule, ItemDialogComponent, RouterModule, ConfirmDeleteDialogComponent, BreadcrumbComponent, PaginationComponent],
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.scss']
})
export class ItemsComponent implements OnInit {
  isFilterVisible: boolean = false;
  isModalOpen: boolean = false;
  isMenuOpen: boolean = false;
  items: IItem[] = [];
  categories!: ICategoryItem[];
  taxes!: ITax[];
  selectedItem: IItem | null = null;
  totalPages: number = 4;
  currentPage: number = 1;

  isConfirmDeleteModalOpen: boolean = false;
  ItemToDeleteId!: number;

  headers: string[] = ['Name', 'Category', 'Price', 'Status'];
  tableData: { Name: string; Category: string; Price: number; Status: string }[] = [];

  filters = {
    name: '',
    price: undefined,
    categoryId: undefined,
    tax: '',
    itemType: '',
    isFeatured: '',
    isActive: ''
  };

  itemTypes = ['Veg', 'NonVeg'];
  features = ['Yes', 'No'];
  statuses = ['Active', 'Inactive'];

  constructor(
    private itemsService: ItemsService,
    private afterActionService: AfterActionService,
    private categoryService: CategoryService,
    private taxService: TaxService,
    private elementRef: ElementRef,
    private exportService: ExportService
  ) { }

  ngOnInit() {
    this.fetchCategories();
    this.fetchTax();

    this.loadItems();
  }

  fetchCategories() {
    this.categoryService.getAllCategories().subscribe((data) => {
      this.categories = data.data;
    });
  }

  fetchTax() {
    this.taxService.getAllTax().subscribe((data) => {
      this.taxes = data.data;
    });
  }

  openConfirmDeleteModal(id: number) {
    this.ItemToDeleteId = id;
    this.isConfirmDeleteModalOpen = true;
  }

  deleteItem(): void {
    if (this.ItemToDeleteId) {
      this.itemsService.deleteItem(this.ItemToDeleteId).subscribe((response) => {
        console.log(`Item with id ${this.ItemToDeleteId} deleted successfully.`, response);
        this.afterActionService.reloadCurrentRoute();
      }, (error) => {
        console.error(`Error deleting item with id ${this.ItemToDeleteId}:`, error);
      });
    }
  }

  applyFilters() {
    this.loadItems();
  }

  loadItems(): void {
    const storedBranch = JSON.parse(localStorage.getItem('selectedBranch') || '{}');

    const { name, price, categoryId, isActive, isFeatured } = this.filters;

    this.itemsService.getAllItemsWithPagination(
      storedBranch.id,
      this.currentPage,
      10,
      name || undefined,
      price || undefined,
      categoryId || undefined,
      isActive ? isActive === 'Active' : undefined,
      isFeatured ? isFeatured === 'Yes' : undefined
    ).subscribe((response) => {
      if (response.success) {
        this.items = response.data;
        this.totalPages = Math.ceil(response.totalCount / 10);

        this.tableData = this.items.map(item => ({
          Name: item.name,
          Category: item.categoryName,
          Price: item.price,
          Status: item.isActive ? 'Active' : 'Inactive'
        }));

        console.log(response)
      }
    }, (error) => {
      console.error('Error fetching items with pagination:', error);
    });
  }

  toggleFilterVisibility() {
    this.isFilterVisible = !this.isFilterVisible;
  }

  openModal(action: string, item: IItem | null) {
    this.selectedItem = item

    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  toggleMenu(event: Event) {
    event.stopPropagation();
    this.isMenuOpen = !this.isMenuOpen;
  }

  exportXLS() {
    this.exportService.exportTableToXls(this.tableData, this.headers, 'ItemsData');
    this.isMenuOpen = false;
  }

  print() {
    this.exportService.exportTableToPdf(this.tableData, this.headers, 'ItemsData');
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
      price: undefined,
      categoryId: undefined,
      tax: '',
      itemType: '',
      isFeatured: '',
      isActive: ''
    };
    this.applyFilters();
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadItems();
  }
}
