import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { IconComponent } from '../../../Components/Shared/icon/icon.component';
import { AfterActionService } from '../../../Services/AfterAction/after-action.service';
import { AnalyticsComponent } from "../analytics/analytics.component";
import { RoleDialogComponent } from "../../Dialogs/role-dialog/role-dialog.component";
import { IRole } from '../../../Models/iroles';
import { RoleService } from '../../../Services/Role/role.service';

@Component({
  selector: 'app-role-and-permissions',
  standalone: true,
  imports: [CommonModule, IconComponent, RouterModule, AnalyticsComponent, RoleDialogComponent],
  templateUrl: './role-and-permissions.component.html',
  styleUrl: './role-and-permissions.component.scss'
})
export class RoleAndPermissionsComponent implements OnInit {
  isModalOpen: boolean = false;
  isMenuOpen: boolean = false;
  roles: IRole[] = [];
  selectedRole: IRole | null = null;
  label: string = '';

  constructor(
    private route: ActivatedRoute,
    private roleService: RoleService,
    private afterActionService: AfterActionService
  ) { }

  ngOnInit(): void {
    this.getAllRoles();

    this.route.url.subscribe((urlSegments) => {
      const path = urlSegments[0]?.path;
      if (path === 'settings') {
        this.label = 'Role & Permissions';
      }
    });
  }

  getAllRoles() {
    this.roleService.getAllRoles().subscribe((response: any) => {
      if (response) {
        this.roles = response.data;
        console.log(response)
      } else {
        console.error('The response is not an array:', response);
        this.roles = [];
      }
    }, (error) => {
      console.error('Failed to load roles:', error);
    });
  }

  openModal(action: string, role: IRole | null) {
    this.selectedRole = role;
    this.isModalOpen = true;
  }

  openItemDetails(category: IRole) {
    localStorage.setItem('selectedRole', JSON.stringify(category));
    localStorage.setItem('selectedComponentName', 'Role & Permissions Details');
    this.afterActionService.reloadCurrentRoute();
  }
}
