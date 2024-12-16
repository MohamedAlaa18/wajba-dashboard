import { CommonModule, DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IconComponent } from "../../Shared/icon/icon.component";
import { ICategory, IItem, IOffer } from '../../../Models/ipromo';
import { OffersService } from '../../../Services/Offers/offers.service';
import { ItemsService } from '../../../Services/Items/items.service';
import { CategoryService } from '../../../Services/Category/category.service';
import { AfterActionService } from '../../../Services/AfterAction/after-action.service';

@Component({
  selector: 'app-offers-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, IconComponent],
  templateUrl: './offers-dialog.component.html',
  styleUrls: ['./offers-dialog.component.scss'],
  providers: [DatePipe],
})
export class OffersDialogComponent implements OnInit {
  @Input() isOpen: boolean = false;
  @Input() offer: IOffer | null = null;
  @Input() IsEmployee: boolean = false;
  @Output() close = new EventEmitter<void>();

  items!: IItem[];
  categories!: ICategory[];

  offerForm: FormGroup;
  selectedFile: File | null = null;

  selectedItems: IItem[] = [];
  selectedCategories: ICategory[] = [];

  itemsDropdownOpen = false;
  categoriesDropdownOpen = false;

  constructor(
    private fb: FormBuilder,
    private offersService: OffersService,
    private categoryService: CategoryService,
    private itemsService: ItemsService,
    private datePipe: DatePipe,
    private afterActionService: AfterActionService,

  ) {
    this.offerForm = this.fb.group({
      name: ['', Validators.required],
      discountType: ['', Validators.required],
      discount: ['', Validators.required],
      discountOn: ['items', Validators.required],
      selectedItems: [[]],
      selectedCategories: [[]],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      description: ['', Validators.required],
      image: ['']
    });
  }

  ngOnInit(): void {
    if (this.offer) {
      this.populateForm(this.offer);
    }

    this.loadCategories();
    this.loadItems();

    this.updateSelectedItemsAndCategoriesValidators();

    this.offerForm.get('discountOn')?.valueChanges.subscribe(() => {
      this.updateSelectedItemsAndCategoriesValidators();
    });
  }

  populateForm(offer: IOffer) {
    const formattedStartDate = this.datePipe.transform(offer.startDate, 'yyyy-MM-dd');
    const formattedEndDate = this.datePipe.transform(offer.endDate, 'yyyy-MM-dd');

    this.offerForm.patchValue({
      name: offer.name,
      discountType: offer.discountType,
      discount: offer.discountPercentage,
      discountOn: offer.items.length > 0 ? 'items' : 'categories',
      selectedItems: offer.items,
      selectedCategories: offer.categories,
      startDate: formattedStartDate,
      endDate: formattedEndDate,
      description: offer.description || '',
    });

    this.selectedItems = offer.items as IItem[];
    this.selectedCategories = offer.categories;
  }


  loadCategories(): void {
    this.categoryService.getAllCategories().subscribe(
      (response: any) => {
        this.categories = response.data;
      },
      (error) => {
        console.error('Error loading categories:', error);
      }
    );
  }

  loadItems(): void {
    const storedBranch = JSON.parse(localStorage.getItem('selectedBranch') || '{}');
    this.itemsService.getAllItems(storedBranch.id).subscribe(
      (response: any) => {
        this.items = response.data;
      },
      (error) => {
        console.error('Error loading items:', error);
      }
    );
  }

  // Handle file selection
  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.selectedFile = input.files[0];
    }
  }

  // Close modal
  closeModal() {
    this.close.emit();
  }

  submitForm(): void {
    if (this.offerForm.valid) {
      const formData = new FormData();
      const formValues = this.offerForm.value;

      // Format the dates to MM-DD-YYYY
      const formattedStartDate = this.datePipe.transform(formValues.startDate, 'MM-dd-yyyy');
      const formattedEndDate = this.datePipe.transform(formValues.endDate, 'MM-dd-yyyy');

      // Check if formatted dates are valid
      if (formattedStartDate === null || formattedEndDate === null) {
        console.error('Invalid date format for startDate or endDate.');
        return; // Exit the method if dates are invalid
      }

      // Append basic fields
      formData.append('name', formValues.name);
      // formData.append('status', this.offer ? formValues.status.toString() : '1');
      formData.append('status', '1');
      formData.append('startDate', formattedStartDate);
      formData.append('endDate', formattedEndDate);
      formData.append('discountType', formValues.discountType.toString());
      formData.append('discountPercentage', formValues.discount.toString());
      formData.append('description', formValues.description);

      // Append Image if selected
      if (this.selectedFile) {
        formData.append('imageUrl', this.selectedFile);
      }

      const discountOn = formValues.discountOn;

      // Handle discountOn conditionally and avoid appending empty arrays/fields
      if (discountOn === 'items' && this.selectedItems.length > 0) {
        // Append ItemIds if items are selected
        this.selectedItems.forEach((item: IItem) => {
          formData.append('itemIds[]', item.id.toString());
        });
      }

      if (discountOn === 'categories' && this.selectedCategories.length > 0) {
        // Append CategoryIds if categories are selected
        this.selectedCategories.forEach((category: ICategory) => {
          formData.append('categoryIds[]', category.id.toString());
        });
      }

      // Ensure you are NOT sending empty values for itemIds[] or categoryIds[]
      // Remove the empty strings you had earlier for empty arrays

      // Debugging: log the form data before submission
      const formDataArray: [string, any][] = [];
      formData.forEach((value, key) => {
        formDataArray.push([key, value]);
      });
      console.log('FormData before sending:', formDataArray);

      // Check if we are updating or creating a new offer
      if (this.offer) {
        this.offersService.updateOffer(this.offer.id, formData).subscribe(
          (response) => {
            console.log('Offer updated successfully:', response);
            this.closeModal();
            this.afterActionService.reloadCurrentRoute();
          },
          (error) => {
            console.error('Error updating offer:', error);
          }
        );
      } else {
        this.offersService.createOffer(formData).subscribe(
          (response) => {
            console.log('Offer created successfully:', response);
            this.closeModal();
            this.afterActionService.reloadCurrentRoute();
          },
          (error) => {
            console.error('Error creating offer:', error);
          }
        );
      }
    } else {
      console.log('Form is invalid:', this.offerForm);
      this.offerForm.markAllAsTouched();
    }
  }

  toggleItemsDropdown() {
    this.itemsDropdownOpen = !this.itemsDropdownOpen;
  }

  toggleCategoriesDropdown() {
    this.categoriesDropdownOpen = !this.categoriesDropdownOpen;
  }

  toggleItemSelection(item: IItem) {
    const index = this.selectedItems.indexOf(item);
    if (index === -1) {
      this.selectedItems.push(item);
    } else {
      this.selectedItems.splice(index, 1);
    }
  }

  toggleCategorySelection(category: ICategory) {
    const index = this.selectedCategories.indexOf(category);
    if (index === -1) {
      this.selectedCategories.push(category);
    } else {
      this.selectedCategories.splice(index, 1);
    }
    this.offerForm.patchValue({ selectedCategories: this.selectedCategories });
  }

  updateSelectedItemsAndCategoriesValidators() {
    const discountOn = this.offerForm.get('discountOn')?.value;

    if (discountOn === 'items') {
      this.offerForm.get('selectedItems')?.setValidators([Validators.required]);
      this.offerForm.get('selectedCategories')?.clearValidators();
    } else if (discountOn === 'categories') {
      this.offerForm.get('selectedCategories')?.setValidators([Validators.required]);
      this.offerForm.get('selectedItems')?.clearValidators();
    }

    // Update validity for both fields
    this.offerForm.get('selectedItems')?.updateValueAndValidity();
    this.offerForm.get('selectedCategories')?.updateValueAndValidity();
  }

  get selectedItemNames(): string {
    return this.selectedItems.map(item => item.name).join(', ');
  }

  get selectedCategoryNames(): string {
    return this.selectedCategories.map(category => category.name).join(', ');
  }

  isItemSelected(item: IItem): boolean {
    return this.selectedItems.includes(item) ||
      this.selectedItems.some(selectedItem => selectedItem.id === item.id);;
  }

  isCategorySelected(category: any): boolean {
    return this.selectedCategories.includes(category) ||
      this.selectedCategories.some(selectedCategory => selectedCategory.id === category.id);
  }
}
