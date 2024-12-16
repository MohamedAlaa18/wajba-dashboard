import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { IconComponent } from '../../Shared/icon/icon.component';
import { ActivatedRoute } from '@angular/router';
import { AfterActionService } from '../../../Services/AfterAction/after-action.service';
import { PopularTodayService } from '../../../Services/PopularToday/popular-today.service';

@Component({
  selector: 'app-popular-today-dialog',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, IconComponent],
  templateUrl: './popular-today-dialog.component.html',
  styleUrls: ['./popular-today-dialog.component.scss']
})
export class PopularTodayDialogComponent implements OnInit {
  @Output() close = new EventEmitter<void>();
  @Input() popular: any;
  popularForm: FormGroup;
  isEditMode = false;
  itemId!: number;
  items: any[] = [];

  constructor(
    private fb: FormBuilder,
    private popularTodayService: PopularTodayService,
    private activatedRoute: ActivatedRoute,
    private afterActionService: AfterActionService,
  ) {
    this.popularForm = this.fb.group({
      item: ['', Validators.required],
      prePrice: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      currentPrice: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      description: ['', Validators.required],
      image: [''],
      status: [1, Validators.required],
    });

    this.itemId = Number(this.activatedRoute.snapshot.paramMap.get('id'));
  }

  ngOnInit() {
    if (this.popular) {
      this.isEditMode = true;
      this.popularForm.patchValue(this.popular);
      console.log(this.popular)
    }

    const storedBranch = JSON.parse(localStorage.getItem('selectedBranch') || '{}');

    this.popularTodayService.getAllItems(storedBranch.id).subscribe(response => {
      this.items = response.data;
      console.log(response)
      if (this.isEditMode) {
        const matchedItem = this.items.find(item => item.id === this.popular.itemId);
        // console.log("matchedItem :", matchedItem);

        if (matchedItem) {
          this.popularForm.patchValue({
            item: matchedItem.id,
          });
        }
      }
    });

    if (this.popular) {
      this.popularForm.patchValue({
        item: this.popular.item,
        prePrice: this.popular.prePrice,
        currentPrice: this.popular.price,
        description: this.popular.description,
      });
    }
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.popularForm.patchValue({ image: file });
    }
  }

  saveExtra() {
    if (this.popularForm.valid) {
      const formData = new FormData();
      formData.append('item', this.popularForm.value.item);
      formData.append('preprice', this.popularForm.value.prePrice);
      formData.append('currentprice', this.popularForm.value.currentPrice);
      formData.append('description', this.popularForm.value.description);
      formData.append('image', this.popularForm.value.image);

      if (this.isEditMode) {
        // Update popular item
        this.popularTodayService.updatePopularItem(
          this.popular.id,
          this.popularForm.value.item,
          Number(this.popularForm.value.prePrice),
          Number(this.popularForm.value.currentPrice),
          this.popularForm.value.description,
          this.popularForm.value.image,
          this.popularForm.value.status
        ).subscribe(
          response => {
            console.log('Item updated:', response);
            this.closeModal();
            this.afterActionService.reloadCurrentRoute();
          },
          error => {
            console.error('Error updating item:', error);
          }
        );
      } else {
        // Create new popular item
        this.popularTodayService.addPopularItem(
          this.popularForm.value.item,
          this.popularForm.value.item,
          Number(this.popularForm.value.prePrice),
          Number(this.popularForm.value.currentPrice),
          this.popularForm.value.description,
          this.popularForm.value.image,
          this.popularForm.value.status
        ).subscribe(
          response => {
            console.log('Item created:', response);
            this.closeModal();
            this.afterActionService.reloadCurrentRoute();
          },
          error => {
            console.error('Error creating item:', error);
          }
        );
      }
    } else {
      console.log('Form is invalid:', this.popularForm);
      this.popularForm.markAllAsTouched();
    }
  }

  closeModal() {
    this.close.emit();
  }

  onSelect(event: Event) {
    const selectedItemId = (event.target as HTMLSelectElement).value;
    const selectedItem = this.items.find(item => item.id === Number(selectedItemId));
    if (selectedItem) {
      this.popularForm.patchValue({
        prePrice: selectedItem.price,
        description: selectedItem.description,
      });
    }
  }
}
