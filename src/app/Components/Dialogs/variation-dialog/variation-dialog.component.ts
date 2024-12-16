import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { IconComponent } from '../../Shared/icon/icon.component';
import { VariationService } from '../../../Services/Variation/variation.service';
import { AttributeService } from '../../../Services/Attribute/attribute.service';
import { ActivatedRoute } from '@angular/router';
import { IAttribute } from '../../../Models/item';
import { AfterActionService } from '../../../Services/AfterAction/after-action.service';

@Component({
  selector: 'app-variation-dialog',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, IconComponent],
  templateUrl: './variation-dialog.component.html',
  styleUrls: ['./variation-dialog.component.scss']
})
export class VariationDialogComponent implements OnInit {
  @Output() close = new EventEmitter<void>();
  @Input() variation: any;
  variationForm: FormGroup;
  itemId!: number;
  attributes!: IAttribute[];
  isEditMode = false;

  constructor(
    private fb: FormBuilder,
    private variationService: VariationService,
    private attributeService: AttributeService,
    private activatedRoute: ActivatedRoute,
    private afterActionService: AfterActionService,
  ) {
    this.variationForm = this.fb.group({
      name: ['', Validators.required],
      price: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      attribute: ['', Validators.required],
      status: ['Active', Validators.required],
      caution: ['']
    });

    this.itemId = Number(this.activatedRoute.snapshot.paramMap.get('id'));
  }

  ngOnInit() {
    // Check if variation is provided (Edit mode)
    this.fetchAttributes();

    if (this.variation) {
      this.isEditMode = true;

      // Patch the form with the variation values
      this.variationForm.patchValue({
        name: this.variation.name,
        price: this.variation.additionalPrice,
        attribute: this.variation.itemattributesId,
        status: this.variation.status === 1 ? 'Active' : 'Inactive',
        caution: this.variation.note || ''
      });
    }
  }

  fetchAttributes(): void {
    this.attributeService.getItemAttributes().subscribe(
      (response) => {
        this.attributes = response.message;
        console.log(response)
      },
      (error) => {
        console.error('Error fetching extras:', error);
      }
    );
  }

  saveVariation() {
    if (this.variationForm.valid) {
      const variationData = {
        name: this.variationForm.value.name,
        note: this.variationForm.value.caution || '',
        status: this.variationForm.value.status === 'Active' ? 1 : 0,
        additionalPrice: Number(this.variationForm.value.price),
        itemattributesId: this.variationForm.value.attribute,
        itemId: this.itemId
      };

      if (this.isEditMode) {
        this.variationService.updateVariation({ id: this.variation.id, ...variationData })
          .subscribe({
            next: (response) => {
              console.log('Variation updated successfully', response);
              this.closeModal();
              this.afterActionService.reloadCurrentRoute();
            },
            error: (err) => console.error('Error updating variation:', err)
          });
      } else {
        this.variationService.createVariation(variationData)
          .subscribe({
            next: (response) => {
              console.log('Variation created successfully', response);
              this.closeModal();
              this.afterActionService.reloadCurrentRoute();
            },
            error: (err) => console.error('Error creating variation:', err)
          });
      }
    } else {
      console.log('Form is invalid:', this.variationForm);
      this.variationForm.markAllAsTouched();
    }
  }

  closeModal() {
    this.close.emit();
  }
}
