import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IconComponent } from "../../Shared/icon/icon.component";
import { AfterActionService } from '../../../Services/AfterAction/after-action.service';
import { IRole } from '../../../Models/iroles';
import { RoleService } from '../../../Services/Role/role.service';

@Component({
  selector: 'app-role-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, IconComponent],
  templateUrl: './role-dialog.component.html',
  styleUrls: ['./role-dialog.component.scss']
})
export class RoleDialogComponent implements OnInit {
  @Input() isOpen: boolean = false;
  @Input() role: IRole | null = null;
  @Output() close = new EventEmitter<void>();

  roleForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private afterActionService: AfterActionService,
    private roleService: RoleService,
  ) {
    this.roleForm = this.fb.group({
      name: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    if (this.role) {
      this.populateForm(this.role);
    }
  }

  populateForm(role: IRole) {
    this.roleForm.patchValue({
      name: role.name,
    });
  }

  closeModal() {
    this.close.emit();
  }

  submitForm() {
    if (this.roleForm.valid) {
      const formData = this.roleForm.value;
      const { name } = formData;

      if (this.role) {
        // Editing an existing role
        this.roleService.updateRole(this.role.id, name)
          .subscribe(response => {
            console.log('Attribute edited:', response);
            this.closeModal();
            this.afterActionService.reloadCurrentRoute();
          }, error => {
            console.error('Error editing attribute:', error);
          });
      } else {
        // Adding a new role
        this.roleService.createRole(name)
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
