import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CompanyService } from '../../../Services/Company/company.service';
import { CommonModule } from '@angular/common';
import { SnackbarService } from '../../../Services/Snackbar/snackbar.service';
import { ICompany } from '../../../Models/icompany';

@Component({
  selector: 'app-company',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.scss']
})
export class CompanyComponent implements OnInit {
  companyForm: FormGroup;
  company!: ICompany;
  logoFile: File | null = null;

  constructor(
    private fb: FormBuilder,
    private companyService: CompanyService,
    private snackbarService: SnackbarService,
  ) {
    // Initialize the form with default values and validators
    this.companyForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^\+?[0-9]{7,14}$/)]],
      website: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      countryCode: ['', Validators.required],
      zipCode: ['', Validators.required],
      address: ['', Validators.required],
      logoUrl: ['']
    });
  }

  ngOnInit(): void {
    this.getCompany();
  }

  getCompany(): void {
    this.companyService.getCompanyById(1).subscribe(
      (response) => {
        this.company = response;

        // Populate form fields with fetched company data
        this.companyForm.patchValue({
          name: this.company.name,
          email: this.company.email,
          phone: this.company.phone,
          website: this.company.websiteURL,
          city: this.company.city,
          state: this.company.state,
          countryCode: this.company.countryCode,
          zipCode: this.company.zipCode,
          address: this.company.address,
          logoUrl: this.company.logoUrl
        });
      },
      (error) => {
        console.error('Error fetching company:', error);
      }
    );
  }

  // Method to handle file input change
  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.logoFile = file;
    }
  }

  // Method to handle form submission
  submitForm() {
    if (this.companyForm.valid) {
      const formData = new FormData();

      // Append form fields to FormData
      formData.append('Name', this.companyForm.get('name')?.value);
      formData.append('Email', this.companyForm.get('email')?.value);
      formData.append('Phone', this.companyForm.get('phone')?.value);
      formData.append('WebsiteURL', this.companyForm.get('website')?.value);
      formData.append('City', this.companyForm.get('city')?.value);
      formData.append('State', this.companyForm.get('state')?.value);
      formData.append('CountryCode', this.companyForm.get('countryCode')?.value);
      formData.append('ZipCode', this.companyForm.get('zipCode')?.value);
      formData.append('Address', this.companyForm.get('address')?.value);

      // Append the file if selected
      if (this.logoFile) {
        formData.append('LogoUrl', this.logoFile);
      }

      // Call the service method to submit the data
      this.companyService.updateCompany(this.company.id, formData).subscribe({
        next: (response) => {
          console.log('Form submitted successfully!', response);
          this.snackbarService.showMessage('Your data has been added successfully');
          this.companyForm.reset();
        },
        error: (error) => {
          console.error('Form submission error:', error);
        }
      });
    } else {
      // Mark all controls as touched to show validation errors
      this.companyForm.markAllAsTouched();
    }
  }
}
