import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IconComponent } from "../../Shared/icon/icon.component";
import { AfterActionService } from '../../../Services/AfterAction/after-action.service';
import { ICurrency } from '../../../Models/icurrency';
import { CurrencyService } from '../../../Services/Currency/currency.service';

@Component({
  selector: 'app-currency-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, IconComponent],
  templateUrl: './currency-dialog.component.html',
  styleUrls: ['./currency-dialog.component.scss']
})
export class CurrencyDialogComponent implements OnInit {
  @Input() isOpen: boolean = false;
  @Input() currency: ICurrency | null = null;
  @Output() close = new EventEmitter<void>();

  currencyForm: FormGroup;
  selectedImage!: File;

  constructor(
    private fb: FormBuilder,
    private afterActionService: AfterActionService,
    private currencyService: CurrencyService,
  ) {
    this.currencyForm = this.fb.group({
      name: ['', Validators.required],
      symbol: ['', Validators.required],
      code: ['', Validators.required],
      exchangeRate: [0, [Validators.required, Validators.min(0)]],
      isCryptoCurrency: ['no', Validators.required]
    });
  }

  ngOnInit(): void {
    if (this.currency) {
      this.populateForm(this.currency);
    }
  }

  populateForm(currency: ICurrency) {
    this.currencyForm.patchValue({
      name: currency.name,
      symbol: currency.symbol,
      code: currency.code,
      exchangeRate: currency.exchangeRate,
      isCryptoCurrency: currency.isCryptoCurrency ? 'yes' : 'no',
    });
  }

  // Method to close the modal
  closeModal() {
    this.close.emit();
  }

  // Handle form submission (add or edit currency)
  submitForm() {
    if (this.currencyForm.valid) {
      // Log the form values before proceeding
      console.log('Form values:', this.currencyForm.value);

      // Create a currencyData object without wrapping it in 'dto'
      const currencyData = {
        name: this.currencyForm.get('name')?.value,
        symbol: this.currencyForm.get('symbol')?.value,
        code: this.currencyForm.get('code')?.value,
        exchangeRate: this.currencyForm.get('exchangeRate')?.value,
        isCryptoCurrency: this.currencyForm.get('isCryptoCurrency')?.value === 'yes'
      };

      console.log('Currency data to be sent:', currencyData);

      if (this.currency) {
        // Update currency
        this.currencyService.updateCurrency(this.currency.id, currencyData)
          .subscribe(response => {
            console.log('Currency updated:', response);
            this.closeModal();
            this.afterActionService.reloadCurrentRoute();
          }, error => {
            console.error('Error updating currency:', error);
          });
      } else {
        // Create new currency
        this.currencyService.createCurrency(currencyData)
          .subscribe(response => {
            console.log('Currency added:', response);
            this.closeModal();
            this.afterActionService.reloadCurrentRoute();
          }, error => {
            console.error('Error adding currency:', error);
          });
      }
    } else {
      this.currencyForm.markAllAsTouched();
    }
  }
}
