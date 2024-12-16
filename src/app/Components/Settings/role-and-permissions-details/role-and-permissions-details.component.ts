import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IPermission, IRole } from '../../../Models/iroles';
import { PermissionService } from '../../../Services/Permission/permission.service';

@Component({
  selector: 'app-role-and-permissions-details',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './role-and-permissions-details.component.html',
  styleUrls: ['./role-and-permissions-details.component.scss']
})
export class RoleAndPermissionsDetailsComponent implements OnInit {
  selectedRole!: IRole;
  permissions!: IPermission[];

  constructor(
    private permissionService: PermissionService,
  ) { }

  ngOnInit(): void {
    const savedCategory = localStorage.getItem('selectedRole');
    if (savedCategory) {
      this.selectedRole = JSON.parse(savedCategory);
    }

    this.permissionService.getPermissions(this.selectedRole.id).subscribe((response: any) => {
      this.permissions = response.data;
      console.log(response);
    }, (error) => {
      console.error('Failed to load permissions:', error);
    });
  }

  submit(): void {
    if (!this.selectedRole || !this.permissions) {
      console.error('Role or permissions are missing');
      return;
    }

    // Call the service to assign permissions to the selected role
    this.permissionService.assignPermissions(this.selectedRole.id, this.permissions).subscribe(
      (response) => {
        console.log('Permissions assigned successfully', response);
        // You can add a success message or any other logic here
      },
      (error) => {
        console.error('Failed to assign permissions', error);
        // You can add error handling logic here
      }
    );
  }
}
