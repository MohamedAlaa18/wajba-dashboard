import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IconComponent } from "../../Shared/icon/icon.component";
import { AfterActionService } from '../../../Services/AfterAction/after-action.service';
import { IAttribute } from '../../../Models/item';
import { AttributeService } from '../../../Services/Attribute/attribute.service';

@Component({
  selector: 'app-attribute-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, IconComponent],
  templateUrl: './attribute-dialog.component.html',
  styleUrl: './attribute-dialog.component.scss'
})
export class AttributeDialogComponent implements OnInit {
  @Input() isOpen: boolean = false;
  @Input() attribute: IAttribute | null = null;
  @Output() close = new EventEmitter<void>();

  attributeForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private afterActionService: AfterActionService,
    private attributeService: AttributeService,
  ) {
    // Initialize the form with only name and status fields
    this.attributeForm = this.fb.group({
      name: ['', Validators.required],
      status: ['active', Validators.required],
    });
  }

  ngOnInit(): void {
    // Populate the form with attribute data if editing
    if (this.attribute) {
      this.populateForm(this.attribute);
    }
  }

  populateForm(attribute: IAttribute) {
    this.attributeForm.patchValue({
      name: attribute.name,
      status: attribute.status === 1 ? 'active' : 'inactive',
    });
  }

  // Method to close the modal
  closeModal() {
    this.close.emit(); // Emit event to close the modal
  }

  // Handle form submission (add or edit attribute)
  submitForm() {
    if (this.attributeForm.valid) {
      const formData = this.attributeForm.value;
      const { name, status, itemAttributes } = formData;

      // Map status to a numeric value
      const statusValue = status === 'active' ? 1 : 0;

      // Prepare request payload
      const requestPayload = {
        name,
        status: statusValue,
        itemAttributes: itemAttributes || [],
      };

      if (this.attribute) {
        // Editing an existing attribute
        this.attributeService.updateItemAttribute(this.attribute.id, requestPayload)
          .subscribe(response => {
            console.log('Attribute edited:', response);
            this.closeModal();
            this.afterActionService.reloadCurrentRoute();
          }, error => {
            console.error('Error editing attribute:', error);
          });
      } else {
        // Adding a new attribute
        this.attributeService.addItemAttribute(requestPayload)
          .subscribe(response => {
            console.log('Attribute added:', response);
            this.closeModal();
            this.afterActionService.reloadCurrentRoute();
          }, error => {
            console.error('Error adding attribute:', error);
          });
      }
    }
  }
}
