import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IconComponent } from "../../Shared/icon/icon.component";
import { ISubscriber } from '../../../Models/isubscriber';


@Component({
  selector: 'app-subscriber-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, IconComponent],
  templateUrl: './subscriber-dialog.component.html',
  styleUrl: './subscriber-dialog.component.scss'
})
export class SubscriberDialogComponent implements OnInit{
  @Input() isOpen: boolean = false;
  @Input() subscriber: ISubscriber | null = null;
  @Output() close = new EventEmitter<void>();

  roles = ['POS Operation', 'Staff', 'Branch Manager'];
  subscriberForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.subscriberForm = this.fb.group({
      sendTo: ['phone', Validators.required],
      subject: [, Validators.required],
      message: ['', Validators.required],
    });
  }

  ngOnInit(): void {
  }

  closeModal() {
    this.close.emit(); // Emit event to close the modal
  }

  submitForm() {
    if (this.subscriberForm.valid) {
      // Handle form submission
    }
  }
}
