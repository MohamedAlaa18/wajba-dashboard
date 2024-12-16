import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IconComponent } from "../../Shared/icon/icon.component";
import { DiningTableService } from '../../../Services/DiningTable/dining-table.service';
import { AfterActionService } from '../../../Services/AfterAction/after-action.service';
import { IDiningTable } from '../../../Models/itable';

@Component({
  selector: 'app-tables-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, IconComponent],
  templateUrl: './tables-dialog.component.html',
  styleUrls: ['./tables-dialog.component.scss'] // Fixed typo from styleUrl to styleUrls
})
export class TablesDialogComponent implements OnInit {
  @Input() isOpen: boolean = false;
  @Input() table: IDiningTable | null = null;
  @Input() IsEmployee: boolean = false;
  @Output() close = new EventEmitter<void>();

  roles = ['POS Operation', 'Staff', 'Branch Manager'];
  tableForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private diningTableService: DiningTableService,
    private afterActionService: AfterActionService,
  ) {
    this.tableForm = this.fb.group({
      name: ['', Validators.required],
      size: [, Validators.required],
      status: [true, Validators.required],
    });
  }

  ngOnInit(): void {
    if (this.table) {
      this.populateForm(this.table);
      console.log(this.table)
    }
    this.updateRoleValidators();
  }

  ngOnChanges(): void {
    this.updateRoleValidators();
  }

  populateForm(table: IDiningTable) {
    this.tableForm.patchValue({
      name: table.name,
      size: table.size,
      status: table.isActive,
    });
  }

  updateRoleValidators() {
    const roleControl = this.tableForm.get('role');
    if (this.IsEmployee) {
      roleControl?.setValidators(Validators.required);
    } else {
      roleControl?.clearValidators();
    }
    roleControl?.updateValueAndValidity();
  }

  closeModal() {
    this.close.emit();
  }

  submitForm() {
    const storedBranch = JSON.parse(localStorage.getItem('selectedBranch') || '{}');
    const branchId = storedBranch.id || null;

    if (this.tableForm.valid) {
      const tableData = {
        name: this.tableForm.value.name,
        size: this.tableForm.value.size,
        isActive: this.tableForm.value.status,
        branchId: branchId
      };

      if (this.table) {
        // Updating an existing table
        this.diningTableService.updateDiningTable(this.table.id, tableData).subscribe(
          response => {
            console.log('Dining table updated successfully:', response);
            this.afterActionService.reloadCurrentRoute();
            this.closeModal();
          },
          error => {
            console.error('Error updating dining table:', error);
          }
        );
      } else {
        // Creating a new dining table
        this.diningTableService.createDiningTable(tableData).subscribe(
          response => {
            console.log('Dining table created successfully:', response);
            this.afterActionService.reloadCurrentRoute();
            this.closeModal();
          },
          error => {
            console.error('Error creating dining table:', error);
          }
        );
      }
    }
  }
}
