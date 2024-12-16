import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { OTPService } from '../../../Services/OTP/otp.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-otp',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './otp.component.html',
  styleUrls: ['./otp.component.scss']
})
export class OTPComponent {
  otpForm: FormGroup;

  // Define arrays for dynamic options
  orderTypes = [
    { label: 'Both', value: 0 },
    { label: 'Mail', value: 1 },
    { label: 'SMS', value: 2 }
  ];

  otpLengths = [4, 6, 8];
  otpExpireTimes = [5, 8, 10];

  constructor(private fb: FormBuilder, private otpService: OTPService) {
    this.otpForm = this.fb.group({
      orderType: ['', Validators.required],
      otpLength: ['', Validators.required],
      otpExpireTime: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.otpForm.valid) {
      const otpData = {
        otpDto: {
          type: this.otpForm.value.orderType,
          digitLimit: this.otpForm.value.otpLength,
          expiryTimeInMinutes: this.otpForm.value.otpExpireTime
        }
      };

      // Call the OTP service to send the data
      this.otpService.sendOtp(otpData).subscribe({
        next: (response) => {
          console.log('OTP sent successfully:', response);
          this.otpForm.reset();
        },
        error: (error) => {
          console.error('Error sending OTP:', error);
          if (error.error instanceof ErrorEvent) {
            // Client-side error
            console.error('An error occurred:', error.error.message);
          } else {
            // Server-side error
            console.error(`Backend returned code ${error.status}, body was: ${error.error}`);
          }
        }
      });
    } else {
      this.otpForm.markAllAsTouched();
    }
  }
}
