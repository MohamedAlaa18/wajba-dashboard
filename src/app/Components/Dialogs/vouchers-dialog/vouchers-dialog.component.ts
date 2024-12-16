import { CommonModule, DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IconComponent } from "../../Shared/icon/icon.component";
import { IVoucher } from '../../../Models/ipromo';
import { VouchersService } from '../../../Services/Vouchers/vouchers.service';
import { AfterActionService } from '../../../Services/AfterAction/after-action.service';

@Component({
  selector: 'app-vouchers-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, IconComponent],
  templateUrl: './vouchers-dialog.component.html',
  styleUrls: ['./vouchers-dialog.component.scss'],
  providers: [DatePipe]
})
export class VouchersDialogComponent implements OnInit {
  @Input() isOpen: boolean = false;
  @Input() voucher: IVoucher | null = null;
  @Input() IsEmployee: boolean = false;
  @Output() close = new EventEmitter<void>();

  roles = ['POS Operation', 'Staff', 'Branch Manager'];
  voucherForm: FormGroup;
  selectedFile: File | null = null;

  constructor(
    private fb: FormBuilder,
    private vouchersService: VouchersService,
    private datePipe: DatePipe,
    private afterActionService: AfterActionService,
  ) {
    this.voucherForm = this.fb.group({
      name: ['', Validators.required],
      code: ['', Validators.required],
      discount: ['', Validators.required],
      limitPerUser: ['',],
      discountType: ['', Validators.required],
      startDate: ['',],
      endDate: ['',],
      minDiscount: ['',],
      maxDiscount: ['', Validators.required],
      description: [''],
    });
  }

  ngOnInit(): void {
    if (this.voucher) {
      this.populateForm(this.voucher);
    }
    this.updateRoleValidators();
  }

  ngOnChanges(): void {
    this.updateRoleValidators();
  }

  populateForm(voucher: IVoucher) {
    this.voucherForm.patchValue({
      name: voucher.name,
      code: voucher.code,
      discount: voucher.discount,
      limitPerUser: voucher.limitPerUser,
      discountType: voucher.discountType,
      startDate: voucher.startDate,
      endDate: voucher.endDate,
      maxDiscount: voucher.maximumDiscount,
      minDiscount: voucher.minimumOrderAmount,
      description: voucher.description,
    });
  }

  updateRoleValidators() {
    const roleControl = this.voucherForm.get('role');
    if (this.IsEmployee) {
      roleControl?.setValidators(Validators.required);
    } else {
      roleControl?.clearValidators();
    }
    roleControl?.updateValueAndValidity();
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.selectedFile = input.files[0];
    }
  }

  closeModal() {
    this.close.emit();
  }

  submitForm() {
    if (this.voucherForm.valid) {
      const formData = new FormData();
      const formValues = this.voucherForm.value;

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
      formData.append('code', formValues.code);
      formData.append('discount', formValues.discount.toString());
      formData.append('discountType', formValues.discountType.toString());
      formData.append('startDate', formattedStartDate);
      formData.append('endDate', formattedEndDate);
      formData.append('minDiscount', formValues.minDiscount);
      formData.append('maxDiscount', formValues.maxDiscount);
      formData.append('limitPerUser', formValues.limitPerUser);
      formData.append('description', formValues.description);

      // Append Image if selected
      if (this.selectedFile) {
        formData.append('imageUrl', this.selectedFile);
      }

      // Retrieve branch data from local storage
      const selectedBranch = localStorage.getItem('selectedBranch');
      if (selectedBranch) {
        const branch = JSON.parse(selectedBranch);
        // Append branchId to the FormData
        formData.append('branchId', branch.id.toString());
      }

      const formDataArray: [string, any][] = [];
      formData.forEach((value, key) => {
        formDataArray.push([key, value]);
      });
      console.log('FormData before sending:', formDataArray);

      // Check if it's an update or a create action
      if (this.voucher) {
        this.vouchersService.updateCoupon(this.voucher.id, formData).subscribe(
          response => {
            if (response.success) {
              console.log('Voucher updated successfully:', response);
              this.afterActionService.reloadCurrentRoute();
              this.close.emit();
            } else {
              console.error('Error updating voucher:', response);
            }
          },
          error => {
            console.error('Error updating voucher:', error);
          }
        );
      } else {
        this.vouchersService.createCoupon(formData).subscribe(
          response => {
            if (response.success) {
              console.log('Voucher created successfully:', response);
              this.close.emit();
              this.afterActionService.reloadCurrentRoute();
            } else {
              console.error('Error creating voucher:', response);
            }
          },
          error => {
            console.error('Error creating voucher:', error);
          }
        );
      }
    } else {
      console.log('Form is invalid:', this.voucherForm);
      this.voucherForm.markAllAsTouched();
    }
  }
}
