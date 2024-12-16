import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormArray, FormsModule, ReactiveFormsModule, ValidationErrors } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IconComponent } from "../../Shared/icon/icon.component";
import { IUser } from '../../../Models/user';
import { IBranch } from '../../../Models/ibranch';
import { environment } from '../../../../environments/environment.development';
import { BranchService } from '../../../Services/Branches/branch.service';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { EmployeeService } from '../../../Services/Employee/employee.service';
import { IRole } from '../../../Models/iroles';
import { RoleService } from '../../../Services/Role/role.service';
import { AfterActionService } from '../../../Services/AfterAction/after-action.service';
import { CustomerService } from '../../../Services/Customer/customer.service';
import { SnackbarService } from '../../../Services/Snackbar/snackbar.service';

@Component({
  selector: 'app-user-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, IconComponent],
  templateUrl: './user-dialog.component.html',
  styleUrls: ['./user-dialog.component.scss']
})
export class UserDialogComponent implements OnInit {
  @Input() isOpen: boolean = false;
  @Input() user: IUser | null = null;
  @Input() IsEmployee: boolean = false;
  @Input() IsCustomer: boolean = false;
  @Input() userType: number = 0;
  @Output() close = new EventEmitter<void>();
  dropdownOpen = false;
  branches!: IBranch[];
  selectedBranches: IBranch[] = [];
  roles!: IRole[];
  userForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private branchService: BranchService,
    private userService: EmployeeService,
    private snackbarService: SnackbarService,
    private customerService: CustomerService,
    private roleService: RoleService,
    private afterActionService: AfterActionService,
  ) {
    this.userForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      status: [1, Validators.required],
      role: [''],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
      branches: this.fb.array([])
    }, { validators: this.passwordsMatch });
  }

  ngOnInit(): void {
    if (this.user) {
      this.populateForm(this.user);
    }
    this.updateRoleValidators();
    this.updateBranchValidators();
    this.getBranch();
    this.getAllRoles();
  }

  ngOnChanges(): void {
    this.updateRoleValidators();
    this.updateBranchValidators();
  }

  passwordsMatch(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordsMismatch: true };
  }

  get branchesFormArray(): FormArray {
    return this.userForm.get('branches') as FormArray;
  }

  populateForm(user: IUser) {
    console.log(user)
    this.userForm.patchValue({
      name: user.name,
      email: user.email,
      phone: user.phoneNumber,
      status: user.status,
      role: user.roleId,
      password: user.password,
      confirmPassword: user.password,
    });

    this.branchesFormArray.clear();
    user.branches.forEach(branch => {
      this.branchesFormArray.push(this.createBranchForm(branch));
      this.selectedBranches.push(branch);
    });
  }

  createBranchForm(branch: any): FormGroup {
    return this.fb.group({
      id: [branch.branchId],
      name: [branch.branchName],
    });
  }

  getBranch() {
    const restaurantId = environment.RESTAURANT_ID;
    this.branchService.getBranchByRestaurantId(restaurantId).subscribe((data) => {
      this.branches = data.data;
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

  updateRoleValidators() {
    const roleControl = this.userForm.get('branches');
    if (this.IsCustomer) {
      roleControl?.clearValidators();
    } else {
      roleControl?.setValidators(Validators.required);
    }
    roleControl?.updateValueAndValidity();
  }

  updateBranchValidators() {
    const roleControl = this.userForm.get('role');
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

  toggleBranchSelection(branch: IBranch): void {
    const index = this.selectedBranches.findIndex(b => b.id === branch.id);
    if (index === -1) {
      this.selectedBranches.push(branch);
      this.branchesFormArray.push(this.fb.control(branch));

    } else {
      this.selectedBranches.splice(index, 1);
      this.branchesFormArray.removeAt(index);
    }
  }

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  get selectedBranchNames(): string {
    return this.selectedBranches.map(branch => branch.name).join(', ');
  }

  submitForm() {
    if (this.userForm.invalid) {
      console.log('Form is invalid:', this.userForm);
      this.userForm.markAllAsTouched();
      return;
    }

    // Common data to be sent in all cases
    const userData: any = {
      name: this.userForm.value.name,
      email: this.userForm.value.email,
      phoneNumber: this.userForm.value.phone,
      password: this.userForm.value.password,
      confirmPassword: this.userForm.value.confirmPassword,
      status: this.userForm.value.status,
      ...(this.IsCustomer ? {} : { userType: this.userType })
    };

    // Conditionally add fields based on userType
    if (this.userType === 1) {
      // Include both role and branches
      userData.roleId = Number(this.userForm.value.role);
      userData.branchIds = this.selectedBranches.map(branch => branch.id);
    } else if (this.userType === 0 || this.userType === 2) {
      // Include branches but exclude role
      userData.branchIds = this.selectedBranches.map(branch => branch.id);
    }

    console.log(userData);

    if (this.user) {
      // Update user
      if (this.IsCustomer) {
        this.customerService.updateCustomer(this.user.id, userData).pipe(
          catchError(error => {
            console.error('Error updating user', error);
            return of(null);
          })
        ).subscribe(response => {
          if (response && response.success) {
            console.log('User updated successfully', response);
            this.afterActionService.reloadCurrentRoute();
            this.closeModal();
          } else {
            console.error('Error updating user', response); // Handle failure here
            this.snackbarService.showMessage(response.errors[0], true);
            console.error('Error updating user', response.errors[0]);
          }
        });

      } else {
        this.userService.updateEmployee(this.user.id, userData).pipe(
          catchError(error => {
            console.error('Error updating user', error);
            return of(null); // Return an observable with `null` in case of error
          })
        ).subscribe(response => {
          if (response) {
            console.log('User updated successfully', response);
            this.afterActionService.reloadCurrentRoute();
            this.closeModal();
          }
        });
      }
    } else {
      // Add new user
      if (this.IsCustomer) {
        this.customerService.addCustomer(userData).pipe(
          catchError(error => {
            console.error('Error adding user', error);
            return of(null);
          })
        ).subscribe(response => {
          if (response.success) {
            console.log('User added successfully', response);
            this.afterActionService.reloadCurrentRoute();
            this.closeModal();
          } else {
            console.error('Error updating user', response); // Handle failure here
            this.snackbarService.showMessage(response.errors[0], true);
            console.error('Error updating user', response.errors[0]);
          }
        });
      } else {
        this.userService.addEmployee(userData).pipe(
          catchError(error => {
            console.error('Error adding user', error);
            return of(null);
          })
        ).subscribe(response => {
          if (response) {
            console.log('User added successfully', response);
            this.afterActionService.reloadCurrentRoute();
            this.closeModal();
          }
        });
      }
    }
  }

  isBranchSelected(branch: IBranch): boolean {
    console.log(branch);
    return this.selectedBranches.includes(branch) ||
      this.selectedBranches.some(selectedBranch => selectedBranch.id === branch.id);
  }
}
