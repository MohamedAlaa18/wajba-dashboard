import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class FormBuilderService {
  constructor(private fb: FormBuilder) { }

  createForm(): FormGroup {
    return this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      city: ['', Validators.required],
      state: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      zipCode: ['', [Validators.required, Validators.pattern(/^\d{5}$/)]],
      address: ['', Validators.required],
      status: ['active'], // Default status
    });
  }

  populateForm(form: FormGroup, data: any): void {
    form.patchValue({
      name: data.name,
      email: data.email,
      city: data.city,
      state: data.state,
      phone: data.phone,
      zipCode: data.zipCode,
      address: data.address,
      status: data.status === 1 ? 'active' : 'inactive',
    });
  }
}
