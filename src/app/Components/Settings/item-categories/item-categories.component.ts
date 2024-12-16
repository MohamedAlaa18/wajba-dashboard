import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { IconComponent } from '../../../Components/Shared/icon/icon.component';
import { AfterActionService } from '../../../Services/AfterAction/after-action.service';
import { CategoryDialogComponent } from "../../Dialogs/category-dialog/category-dialog.component";
import { ICategoryItem } from '../../../Models/category-item';
import { CategoryService } from '../../../Services/Category/category.service';
import { ConfirmDeleteDialogComponent } from '../../Dialogs/confirm-delete-dialog/confirm-delete-dialog.component';

@Component({
  selector: 'app-item-categories',
  standalone: true,
  imports: [CommonModule, IconComponent, RouterModule, CategoryDialogComponent, ConfirmDeleteDialogComponent],
  templateUrl: './item-categories.component.html',
  styleUrl: './item-categories.component.scss'
})
export class ItemCategoriesComponent implements OnInit {
  isModalOpen: boolean = false;
  isMenuOpen: boolean = false;
  categories: ICategoryItem[] = [];
  selectedCategory: ICategoryItem | null = null;
  label: string = '';
  openDetails: boolean = false

  isConfirmDeleteModalOpen: boolean = false;
  categoryToDeleteId!: number;

  constructor(
    private route: ActivatedRoute,
    private categoryService: CategoryService,
    private afterActionService: AfterActionService
  ) { }

  ngOnInit(): void {
    this.getAllCategories();

    this.route.url.subscribe((urlSegments) => {
      const path = urlSegments[0]?.path;
      if (path === 'settings') {
        this.label = 'Item Category';
      }
    });
    this.selectedCategory = this.categories[1];
  }

  getAllCategories() {
    this.categoryService.getAllCategories().subscribe((response: any) => {
      if (response) {
        this.categories = response.data;
      } else {
        console.error('The response is not an array:', response);
        this.categories = [];
      }
    }, (error) => {
      console.error('Failed to load taxes:', error);
    });
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  openModal(action: string, tax: ICategoryItem | null) {
    this.selectedCategory = tax;
    this.isModalOpen = true;
  }

  openConfirmDeleteModal(id: number) {
    this.categoryToDeleteId = id;
    this.isConfirmDeleteModalOpen = true;
  }

  deleteCategory() {
    if (this.categoryToDeleteId) {
      this.categoryService.deleteCategory(this.categoryToDeleteId).subscribe(() => {
        console.log(`Category with id: ${this.categoryToDeleteId} deleted successfully.`);
        this.getAllCategories();
        this.afterActionService.reloadCurrentRoute();
        this.isConfirmDeleteModalOpen = false;
      }, (error) => {
        console.error('Failed to delete category:', error);
      });
    }
  }

  openItemDetails(category: ICategoryItem) {
    localStorage.setItem('selectedCategory', JSON.stringify(category));
    localStorage.setItem('selectedComponentName', 'Item categories Details');
    this.afterActionService.reloadCurrentRoute();
  }
}
