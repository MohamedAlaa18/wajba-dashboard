import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IconComponent } from "../../Shared/icon/icon.component";

@Component({
  selector: 'app-time-slot-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, IconComponent],
  templateUrl: './time-slot-dialog.component.html',
  styleUrl: './time-slot-dialog.component.scss'
})
export class TimeSlotDialogComponent {
  @Input() weekDayId: number | null = null;
  @Input() isOpen: boolean = false;
  @Output() close = new EventEmitter<void>();
  @Output() saveTimeSlot = new EventEmitter<{ openingTime: string; closingTime: string; weekDayId: number }>();

  timeSlotForm: FormGroup;

  constructor(private fb: FormBuilder) {
    // Initialize the form with default values
    this.timeSlotForm = this.fb.group({
      openingTime: ['', Validators.required],
      closingTime: ['', Validators.required],
    });
  }

  closeModal() {
    this.close.emit(); // Emit event to close the modal
  }

  submitForm() {
    if (this.timeSlotForm.valid) {
      const timeSlotData = {
        ...this.timeSlotForm.value,
        weekDayId: this.weekDayId // Pass the stored weekDayId
      };
      this.saveTimeSlot.emit(timeSlotData);  // Emit with weekDayId
      this.closeModal();
    }
  }
}
