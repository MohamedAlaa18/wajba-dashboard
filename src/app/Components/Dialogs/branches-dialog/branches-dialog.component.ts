import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IconComponent } from "../../Shared/icon/icon.component";
import { AfterActionService } from '../../../Services/AfterAction/after-action.service';
import { IBranch } from '../../../Models/ibranch';
import { BranchService } from '../../../Services/Branches/branch.service';
import { MapComponent } from "../../map/map.component";
import { MapDialogComponent } from "../map-dialog/map-dialog.component";

@Component({
  selector: 'app-branches-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, IconComponent, MapComponent, MapDialogComponent],
  templateUrl: './branches-dialog.component.html',
  styleUrls: ['./branches-dialog.component.scss']
})
export class BranchesDialogComponent implements OnInit {
  @Input() isOpen: boolean = false;
  @Input() branch: IBranch | null = null;
  @Output() close = new EventEmitter<void>();

  branchForm: FormGroup;
  isMapModalOpen: boolean = false;

  constructor(
    private fb: FormBuilder,
    private afterActionService: AfterActionService,
    private branchService: BranchService,
  ) {
    this.branchForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      city: ['', Validators.required],
      state: ['', Validators.required],
      phone: ['', [Validators.required]],
      zipCode: ['', [Validators.required]],
      address: ['', Validators.required],
      status: ['active'],
      longitude: ['', [Validators.required]],
      latitude: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    if (this.branch) {
      this.populateForm(this.branch);
    }
  }

  populateForm(branch: IBranch) {
    this.branchForm.patchValue({
      name: branch.name,
      email: branch.email,
      city: branch.city,
      state: branch.state,
      phone: branch.phone,
      zipCode: branch.zipCode,
      address: branch.address,
      status: branch.status === 1 ? 'active' : 'inactive',
      longitude: branch.longitude || '',
      latitude: branch.latitude || '',
    });
  }

  closeModal() {
    this.close.emit();
  }

  submitForm() {
    if (this.branchForm.valid) {
      const formData = {
        ...this.branchForm.value,
        status: this.branchForm.value.status === 'active' ? 1 : 0,
      };

      if (this.branch) {
        // Editing an existing branch
        this.branchService.editBranch(this.branch.id, formData)
          .subscribe(response => {
            console.log('Branch edited:', response);
            this.closeModal();
            this.afterActionService.reloadCurrentRoute();
          }, error => {
            console.error('Error editing branch:', error);
          });
      } else {
        // Adding a new branch
        this.branchService.addBranch(formData)
          .subscribe(response => {
            console.log('Branch added:', response);
            this.closeModal();
            this.afterActionService.reloadCurrentRoute();
          }, error => {
            console.error('Error adding branch:', error);
          });
      }
    } else {
      this.branchForm.markAllAsTouched();
    }
  }

  openMapModal() {
    this.isMapModalOpen = true;
  }

  closeMapModal() {
    this.isMapModalOpen = false;
  }

  // Method to receive coordinates from the map modal
  setCoordinates(longitude: number, latitude: number) {
    this.branchForm.patchValue({
      longitude: longitude,
      latitude: latitude
    });
    this.closeMapModal();
  }
}
