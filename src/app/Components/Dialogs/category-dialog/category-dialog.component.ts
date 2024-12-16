import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IconComponent } from "../../Shared/icon/icon.component";
import { AfterActionService } from '../../../Services/AfterAction/after-action.service';
import { ICategoryItem } from '../../../Models/category-item';
import { CategoryService } from '../../../Services/Category/category.service';

@Component({
  selector: 'app-category-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, IconComponent],
  templateUrl: './category-dialog.component.html',
  styleUrl: './category-dialog.component.scss'
})
export class CategoryDialogComponent implements OnInit {
  @Input() isOpen: boolean = false;
  @Input() category: ICategoryItem | null = null;
  @Output() close = new EventEmitter<void>();

  categoryForm: FormGroup;
  selectedImage!: File;

  constructor(
    private fb: FormBuilder,
    private afterActionService: AfterActionService,
    private categoryService: CategoryService,
  ) {
    // Initialize the form with default values
    this.categoryForm = this.fb.group({
      name: ['', Validators.required],
      image: [null, Validators.required],  // Image field added
      description: ['', Validators.required],
      status: ['active'],  // Default value set to 'active'
    });
  }

  ngOnInit(): void {
    // Populate the form with category data if editing
    if (this.category) {
      this.populateForm(this.category);
    }
  }

  // Method to populate the form with existing category data
  populateForm(category: ICategoryItem) {
    this.categoryForm.patchValue({
      name: category.name,
      description: category.description,
      status: category.status === 1 ? 'active' : 'inactive',
    });
  }

  // Handle image selection
  onImageSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedImage = file;
      this.categoryForm.patchValue({ image: file });
    }
  }

  // Method to close the modal
  closeModal() {
    this.close.emit(); // Emit event to close the modal
  }

  // Handle form submission (add or edit category)
  submitForm() {
    if (this.categoryForm.valid) {
      const name = this.categoryForm.get('name')?.value;
      const description = this.categoryForm.get('description')?.value;
      const status = this.categoryForm.get('status')?.value === 'active' ? 1 : 0;
      const image = this.selectedImage;

      if (this.category) {
        this.categoryService.updateCategory(this.category.id, name, image, status, description)
          .subscribe(response => {
            console.log('Category edited:', response);
            this.closeModal();
            this.afterActionService.reloadCurrentRoute();
          }, error => {
            console.error('Error editing category:', error);
          });
      } else {
        this.categoryService.addCategory(name, image, status, description)
          .subscribe(response => {
            console.log('Category added:', response);
            this.closeModal();
            this.afterActionService.reloadCurrentRoute();
          }, error => {
            console.error('Error adding category:', error);
          });
      }
    } else {
      this.categoryForm.markAllAsTouched();
    }
  }
}
