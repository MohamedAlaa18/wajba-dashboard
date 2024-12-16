import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { IconComponent } from '../../../Components/Shared/icon/icon.component';
import { AfterActionService } from '../../../Services/AfterAction/after-action.service';
import { IBranch } from '../../../Models/ibranch';
import { BranchService } from '../../../Services/Branches/branch.service';
import { BranchesDialogComponent } from '../../Dialogs/branches-dialog/branches-dialog.component';
import { ConfirmDeleteDialogComponent } from '../../Dialogs/confirm-delete-dialog/confirm-delete-dialog.component';

@Component({
  selector: 'app-branches',
  standalone: true,
  imports: [CommonModule, IconComponent, BranchesDialogComponent, RouterModule, ConfirmDeleteDialogComponent],
  templateUrl: './branches.component.html',
  styleUrl: './branches.component.scss'
})
export class BranchesComponent implements OnInit {
  isFilterVisible: boolean = false;
  isModalOpen: boolean = false;
  isMenuOpen: boolean = false;
  branches: IBranch[] = [];
  selectedBranch: IBranch | null = null;
  branchLabel: string = '';

  isConfirmDeleteModalOpen: boolean = false;
  branchToDeleteId!: number;

  constructor(
    private route: ActivatedRoute,
    private branchService: BranchService,
    private afterActionService: AfterActionService
  ) { }

  ngOnInit(): void {
    // Fetch all taxes on component initialization
    this.getAllBranches();

    // Subscribe to route changes and adjust labels based on the path
    this.route.url.subscribe((urlSegments) => {
      const path = urlSegments[0]?.path;
      if (path === 'settings') {
        this.branchLabel = 'Branches';
      }
    });
  }

  getAllBranches() {
    this.branchService.getAllBranches().subscribe((response: any) => {
      if (response) {
        this.branches = response.data;
        console.log(response)
      } else {
        console.error('The response is not an array:', response);
        this.branches = [];
      }
    }, (error) => {
      console.error('Failed to load taxes:', error);
    });
  }

  toggleFilterVisibility() {
    this.isFilterVisible = !this.isFilterVisible;
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  openModal(action: string, tax: IBranch | null) {
    this.selectedBranch = tax;
    this.isModalOpen = true;
  }

  openConfirmDeleteModal(id: number) {
    this.branchToDeleteId = id;
    this.isConfirmDeleteModalOpen = true;
  }

  deleteBranch() {
    if (this.branchToDeleteId) {
      this.branchService.deleteBranch(this.branchToDeleteId).subscribe(() => {
        console.log(`Branch with id: ${this.branchToDeleteId} deleted successfully.`);
        this.getAllBranches();
        this.afterActionService.reloadCurrentRoute();
      }, (error) => {
        console.error('Failed to delete branch:', error);
      });
    }
  }

  openBranchDetails(branch: IBranch) {
    localStorage.setItem('selectedBranch', JSON.stringify(branch));
    localStorage.setItem('selectedComponentName', 'Branches Details');
    this.afterActionService.reloadCurrentRoute();
  }
}
