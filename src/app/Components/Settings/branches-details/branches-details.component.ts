import { Component } from '@angular/core';
import { BreadcrumbComponent } from '../../Shared/breadcrumb/breadcrumb.component';
import { IBranch } from '../../../Models/ibranch';

@Component({
  selector: 'app-branches-details',
  standalone: true,
  imports: [BreadcrumbComponent],
  templateUrl: './branches-details.component.html',
  styleUrl: './branches-details.component.scss'
})
export class BranchesDetailsComponent {
  selectedBranch!: IBranch;

  ngOnInit(): void {
    const savedBranch = localStorage.getItem('selectedBranch');
    if (savedBranch) {
      this.selectedBranch = JSON.parse(savedBranch);
    }
  }
}
