import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SnackbarService } from '../../../Services/Snackbar/snackbar.service';
import { EmailService } from '../../../Services/Email/email.service';
import { CommonModule } from '@angular/common';
import { IEmail } from '../../../Models/iemail';

@Component({
  selector: 'app-email',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './email.component.html',
  styleUrls: ['./email.component.scss']
})
export class EmailComponent implements OnInit {
  emailForm: FormGroup;
  email!: IEmail;
  logoFile: File | null = null;

  constructor(
    private fb: FormBuilder,
    private snackbarService: SnackbarService,
    private emailService: EmailService
  ) {
    // Initialize the form with default values and validators
    this.emailForm = this.fb.group({
      mailHost: ['', Validators.required],
      mailPort: ['', Validators.required],
      mailUsername: ['', Validators.required],
      mailPassword: ['', Validators.required],
      mailFromName: ['', Validators.required],
      mailFromEmail: ['', [Validators.required, Validators.email]],
      mailEncryption: ['SSI', Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadEmailConfig();
  }

  // Fetch existing email configuration
  loadEmailConfig(): void {
    this.emailService.getEmailConfig().subscribe(
      (response) => {
        const emailConfig = response.data[0];
        this.emailForm.patchValue({
          mailHost: emailConfig.host,
          mailPort: emailConfig.port,
          mailUsername: emailConfig.userName,
          mailPassword: emailConfig.password,
          mailFromName: emailConfig.name,
          mailFromEmail: emailConfig.email,
          mailEncryption: emailConfig.mailEncryption,
        });
      },
      (error) => {
        this.snackbarService.showMessage('Failed to load email configuration.', true);
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

  // Method to handle form submission for updating email configuration
  submitForm() {
    if (this.emailForm.valid) {
      const emailConfig: any = {
        Host: this.emailForm.value.mailHost,
        Port: this.emailForm.value.mailPort,
        UserName: this.emailForm.value.mailUsername,
        Password: this.emailForm.value.mailPassword,
        Name: this.emailForm.value.mailFromName,
        Email: this.emailForm.value.mailFromEmail,
        MailEncryption: String(this.emailForm.value.mailEncryption)
      };

      this.emailService.updateEmailConfig(emailConfig).subscribe(
        (response) => {
          console.log(response);
          this.snackbarService.showMessage('Email configuration updated successfully.', response);
        },
        (error) => {
          console.error(error);
          this.snackbarService.showMessage('Failed to update email configuration.', true);
        }
      );
    } else {
      this.emailForm.markAllAsTouched();
    }
  }
}
