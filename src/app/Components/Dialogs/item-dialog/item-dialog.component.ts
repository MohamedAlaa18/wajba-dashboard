import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IconComponent } from "../../Shared/icon/icon.component";
import { ItemsService } from '../../../Services/Items/items.service';
import { CategoryService } from '../../../Services/Category/category.service';
import { ICategoryItem } from '../../../Models/category-item';
import { TaxService } from '../../../Services/Tax/tax.service';
import { ITax } from '../../../Models/itax';
import { IItem } from '../../../Models/item';
import { BranchService } from '../../../Services/Branches/branch.service';
import { environment } from '../../../../environments/environment.development';
import { IBranch } from '../../../Models/ibranch';
import { AfterActionService } from '../../../Services/AfterAction/after-action.service';

@Component({
  selector: 'app-item-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, IconComponent],
  templateUrl: './item-dialog.component.html',
  styleUrls: ['./item-dialog.component.scss']
})
export class ItemDialogComponent implements OnInit {
  @Input() isOpen: boolean = false;
  @Input() item: IItem | null = null;
  @Output() close = new EventEmitter<void>();

  selectedFileName: string | null = null;
  itemForm: FormGroup;
  selectedFile: File | null = null;
  categories!: ICategoryItem[];
  taxes!: ITax[];
  branches!: IBranch[];
  selectedBranches: IBranch[] = [];
  dropdownOpen = false;

  constructor(
    private fb: FormBuilder,
    private itemsService: ItemsService,
    private categoryService: CategoryService,
    private taxService: TaxService,
    private branchService: BranchService,
    private afterActionService: AfterActionService,
  ) {
    this.itemForm = this.fb.group({
      name: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(0)]],
      category: ['', Validators.required],
      tax: [''],
      itemType: ['Veg', Validators.required],
      status: [1, Validators.required],
      branches: this.fb.array([], Validators.required),
      isFeatured: [false, Validators.required],
      image: [''],
      description: ['', Validators.required],
      note: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.fetchCategories();
    this.fetchTax();
    this.getBranch();

    if (this.item) {
      this.populateForm(this.item);
    } else {
      this.loadSelectedBranchesFromStorage();
    }
  }

  get branchesFormArray(): FormArray {
    return this.itemForm.get('branches') as FormArray;
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

  getBranch() {
    const restaurantId = environment.RESTAURANT_ID;
    this.branchService.getBranchByRestaurantId(restaurantId).subscribe((data) => {
      this.branches = data.data;
    });
  }

  populateForm(item: IItem) {
    this.itemForm.patchValue({
      name: item.name,
      price: item.price,
      category: item.categoryId,
      tax: item.taxValue,
      itemType: item.itemType,
      status: item.isActive,
      description: item.description || '',
      note: item.note || '',
      isFeatured: item.isFeatured || false,
    });

    // Populate branches
    this.branchesFormArray.clear();
    item.branches.forEach(branch => {
      this.branchesFormArray.push(this.createBranchForm(branch));
      this.selectedBranches.push(branch); // Add to selected branches
    });

    this.saveSelectedBranchesToStorage();
  }

  createBranchForm(branch: any): FormGroup {
    return this.fb.group({
      id: [branch.id],
      name: [branch.name],
    });
  }

  toggleBranchSelection(branch: IBranch): void {
    const index = this.selectedBranches.findIndex(b => b.id === branch.id);
    if (index === -1) {
      this.selectedBranches.push(branch);
      this.branchesFormArray.push(this.fb.control(branch));

    } else {
      this.selectedBranches.splice(index, 1);
      this.branchesFormArray.removeAt(index);
    }
    this.saveSelectedBranchesToStorage();
  }

  saveSelectedBranchesToStorage(): void {
    localStorage.setItem('selectedBranches', JSON.stringify(this.selectedBranches.map(b => b.id)));
  }

  loadSelectedBranchesFromStorage(): void {
    const storedBranchIds = JSON.parse(localStorage.getItem('selectedBranches') || '[]');
    this.selectedBranches = this.branches.filter(branch => storedBranchIds.includes(branch.id));
    this.selectedBranches.forEach(branch => this.branchesFormArray.push(this.createBranchForm(branch)));
  }

  submitForm() {
    if (this.itemForm.valid) {
      const formValue = this.itemForm.value;

      const itemData: any = {
        Name: formValue.name,
        Price: formValue.price,
        IsFeatured: formValue.isFeatured,
        status: formValue.status,
        ItemType: formValue.itemType === 'Veg' ? 1 : 0,
        Note: formValue.note,
        Description: formValue.description,
        TaxValue: formValue.tax,
        CategoryId: formValue.category,
        BranchIds: this.selectedBranches.map(branch => branch.id),
      };

      if (this.selectedFile) {
        itemData.ImageUrl = this.selectedFile;
      }

      if (this.item) {
        const updatedItemData = {
          ...itemData,
          Id: this.item.id
        };

        this.itemsService.editItem(updatedItemData).subscribe(
          (response) => {
            console.log('Item updated successfully', response);
            this.afterActionService.reloadCurrentRoute();
            this.closeModal();
          },
          (error) => {
            console.error('Error updating item', error);
          }
        );
      } else {
        this.itemsService.addItem(itemData).subscribe(
          (response) => {
            console.log('Item added successfully', response);
            this.afterActionService.reloadCurrentRoute();
            this.closeModal();
          },
          (error) => {
            console.error('Error adding item', error);
          }
        );
      }
    } else {
      console.log('Form is invalid:', this.itemForm);
      this.itemForm.markAllAsTouched();
    }
  }

  onFileSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFileName = input.files[0].name;
      this.selectedFile = input.files[0];
    } else {
      this.selectedFileName = null;
      this.selectedFile = null;
    }
  }

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  closeModal() {
    this.close.emit();
  }

  get selectedBranchNames(): string {
    return this.selectedBranches.map(branch => branch.name).join(', ');
  }

  isBranchSelected(branch: IBranch): boolean {
    console.log(branch);
    return this.selectedBranches.includes(branch) ||
      this.selectedBranches.some(selectedBranch => selectedBranch.id === branch.id);
  }
}
