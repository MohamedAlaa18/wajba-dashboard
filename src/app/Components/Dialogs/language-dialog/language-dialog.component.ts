import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IconComponent } from "../../Shared/icon/icon.component";
import { AfterActionService } from '../../../Services/AfterAction/after-action.service';
import { ILanguage } from '../../../Models/ilanguage';
import { LanguageService } from '../../../Services/Language/language.service';

@Component({
  selector: 'app-language-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, IconComponent],
  templateUrl: './language-dialog.component.html',
  styleUrl: './language-dialog.component.scss'
})
export class LanguageDialogComponent implements OnInit {
  @Input() isOpen: boolean = false;
  @Input() language: ILanguage | null = null;
  @Output() close = new EventEmitter<void>();

  languageForm: FormGroup;
  selectedImage!: File;

  constructor(
    private fb: FormBuilder,
    private afterActionService: AfterActionService,
    private languageService: LanguageService,
  ) {
    this.languageForm = this.fb.group({
      name: ['', Validators.required],
      code: ['', Validators.required],
      image: [null, Validators.required],
      status: ['active', Validators.required],
    });
  }

  ngOnInit(): void {
    if (this.language) {
      this.populateForm(this.language);
    }
  }

  populateForm(language: ILanguage) {
    this.languageForm.patchValue({
      name: language.name,
      code: language.code,
      status: language.status === 1 ? 'active' : 'inactive',
    });
  }

  // Handle image selection
  onImageSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedImage = file;
      this.languageForm.patchValue({ image: file });
    }
  }

  // Method to close the modal
  closeModal() {
    this.close.emit(); // Emit event to close the modal
  }

  // Handle form submission (add or edit language)
  submitForm() {
    if (this.languageForm.valid) {
      const formData = new FormData();
      formData.append('name', this.languageForm.get('name')?.value);
      formData.append('code', this.languageForm.get('code')?.value);
      formData.append('status', this.languageForm.get('status')?.value === 'active' ? '1' : '0');
      formData.append('ImageUrl', this.selectedImage);

      if (this.language) {
        this.languageService.updateLanguage(this.language.id, formData)
          .subscribe(response => {
            console.log('Language updated:', response);
            this.closeModal();
            this.afterActionService.reloadCurrentRoute();
          }, error => {
            console.error('Error updating language:', error);
          });
      } else {
        this.languageService.createLanguage(formData)
          .subscribe(response => {
            console.log('Language added:', response);
            this.closeModal();
            this.afterActionService.reloadCurrentRoute();
          }, error => {
            console.error('Error adding language:', error);
          });
      }
    } else {
      this.languageForm.markAllAsTouched();
    }
  }
}
