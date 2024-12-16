import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ThemeService } from '../../../Services/Theme/theme.service';

@Component({
  selector: 'app-theme',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './theme.component.html',
  styleUrls: ['./theme.component.scss']
})
export class ThemeComponent {
  themeForm: FormGroup;
  logoPreview: string | null = null;
  browserIconPreview: string | null = null;
  footerLogoPreview: string | null = null;

  logoFile!: File; // Store files separately
  browserIconFile!: File;
  footerLogoFile!: File;

  constructor(private fb: FormBuilder, private themeService: ThemeService) {
    this.themeForm = this.fb.group({
      logoFile: [null, Validators.required], // Keep for validation
      browserIconFile: [null, Validators.required],
      footerLogoFile: [null, Validators.required]
    });
  }

  // Handles file selection and preview generation
  onFileSelected(event: Event, type: string): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        if (type === 'logo') {
          this.logoPreview = result;
          this.logoFile = file; // Store file separately
        } else if (type === 'browserIcon') {
          this.browserIconPreview = result;
          this.browserIconFile = file;
        } else if (type === 'footerLogo') {
          this.footerLogoPreview = result;
          this.footerLogoFile = file;
        }
      };
      reader.readAsDataURL(file);
    }
  }

  // Submit the form data using the ThemeService
  onSubmit(): void {
    if (this.themeForm.valid) {
      // Submit the files stored separately
      this.themeService.submitTheme(this.logoFile, this.browserIconFile, this.footerLogoFile).subscribe(
        response => {
          console.log('Theme updated successfully:', response);
          this.themeForm.reset();
        },
        error => {
          console.error('Error updating theme:', error);
        }
      );
    } else {
      this.themeForm.markAllAsTouched();
    }
  }
}
