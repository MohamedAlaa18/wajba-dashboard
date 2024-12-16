import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IconComponent } from "../../Shared/icon/icon.component";
import { TaxService } from '../../../Services/Tax/tax.service';
import { ITax } from '../../../Models/itax';
import { AfterActionService } from '../../../Services/AfterAction/after-action.service';

@Component({
  selector: 'app-taxes-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, IconComponent],
  templateUrl: './taxes-dialog.component.html',
  styleUrls: ['./taxes-dialog.component.scss']
})
export class TaxesDialogComponent implements OnInit {
  @Input() isOpen: boolean = false;
  @Input() tax: ITax | null = null;
  @Output() close = new EventEmitter<void>();

  taxForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private taxService: TaxService,
    private afterActionService: AfterActionService,
  ) {
    // Initialize the form with default values
    this.taxForm = this.fb.group({
      name: ['', Validators.required],
      code: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
      taxRate: ['', [Validators.required, Validators.min(0)]],
      status: ['active', Validators.required],
    });
  }

  ngOnInit(): void {
    // Populate the form with tax data if editing
    if (this.tax) {
      this.populateForm(this.tax);
    }
  }

  // Method to populate the form with existing tax data
  populateForm(tax: ITax) {
    this.taxForm.patchValue({
      name: tax.name,
      code: tax.code,
      taxRate: tax.taxRate,
      status: tax.status === 1 ? 'active' : 'inactive',
    });
  }

  // Method to close the modal
  closeModal() {
    this.close.emit(); // Emit event to close the modal
  }

  // Handle form submission (add or edit tax)
  submitForm() {
    if (this.taxForm.valid) {
      const formData = this.taxForm.value;
      const { name, code, taxRate, status } = formData;

      const statusValue = status === 'active' ? 1 : 0;
      const codeValue = parseInt(code, 10);
      const taxRateValue = parseFloat(taxRate);

      if (this.tax) {
        // Editing an existing tax
        this.taxService.editTax(this.tax.id, { name, code: codeValue, taxRate: taxRateValue, status: statusValue })
          .subscribe(response => {
            console.log('Tax edited:', response);
            this.closeModal();
            this.afterActionService.reloadCurrentRoute();
          }, error => {
            console.error('Error editing tax:', error);
          });
      } else {
        // Adding a new tax
        this.taxService.addTax({ name, code: codeValue, taxRate: taxRateValue, status: statusValue })
          .subscribe(response => {
            console.log('Tax added:', response);
            this.closeModal();
            this.afterActionService.reloadCurrentRoute();
          }, error => {
            console.error('Error adding tax:', error);
          });
      }
    } else {
      // Mark all controls as touched to show validation errors
      this.taxForm.markAllAsTouched();
    }
  }
}
