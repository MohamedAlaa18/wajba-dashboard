import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { IconComponent } from '../../Shared/icon/icon.component';
import { ExtraService } from '../../../Services/Extra/extra.service';
import { ActivatedRoute } from '@angular/router';
import { AfterActionService } from '../../../Services/AfterAction/after-action.service';

@Component({
  selector: 'app-extra-dialog',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, IconComponent],
  templateUrl: './extra-dialog.component.html',
  styleUrls: ['./extra-dialog.component.scss']
})
export class ExtraDialogComponent implements OnInit {
  @Output() close = new EventEmitter<void>();
  @Input() extra: any;
  extraForm: FormGroup;
  isEditMode = false;
  itemId!: number;

  constructor(
    private fb: FormBuilder,
    private extraService: ExtraService,
    private activatedRoute: ActivatedRoute,
    private afterActionService: AfterActionService,
  ) {
    this.extraForm = this.fb.group({
      name: ['', Validators.required],
      price: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      status: ['Active', Validators.required],
    });

    this.itemId = Number(this.activatedRoute.snapshot.paramMap.get('id'));
  }

  ngOnInit() {
    if (this.extra) {
      this.isEditMode = true;
      this.extraForm.patchValue(this.extra);
    }

    this.extraForm.patchValue({
      name: this.extra.name,
      price: this.extra.additionalPrice,
      status: this.extra.status === 1 ? 'Active' : 'Inactive',
    });
  }

  saveExtra() {
    if (this.extraForm.valid) {

      const ExtraData = {
        name: this.extraForm.value.name,
        status: this.extraForm.value.status === 'Active' ? 1 : 0,
        additionalPrice: Number(this.extraForm.value.price),
        itemId: this.itemId
      };

      if (this.isEditMode) {
        // Update existing extra
        this.extraService.updateExtra({ id: this.extra.id, ...ExtraData })
          .subscribe(
            response => {
              console.log('Extra updated:', response);
              this.closeModal();
              this.afterActionService.reloadCurrentRoute();
            },
            error => {
              console.error('Error updating extra:', error);
            }
          );
      } else {
        // Create a new extra
        this.extraService.createExtra(ExtraData)
          .subscribe(
            response => {
              console.log('Extra created:', response);
              this.closeModal();
              this.afterActionService.reloadCurrentRoute();
            },
            error => {
              console.error('Error creating extra:', error);
            }
          );
      }
    } else {
      console.log('Form is invalid:', this.extraForm);
      this.extraForm.markAllAsTouched();
    }
  }

  closeModal() {
    this.close.emit();
  }
}
