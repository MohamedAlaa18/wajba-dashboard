import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AfterActionService } from '../../../Services/AfterAction/after-action.service';

interface Breadcrumb {
  name: string;
  link: string;
}

@Component({
  selector: 'app-breadcrumb',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss']
})
export class BreadcrumbComponent {
  @Input() breadcrumbs: Breadcrumb[] = [];

   constructor(private afterActionService:AfterActionService){}

  handleBreadcrumbClick(name: string, index: number): void {
    // Check if the current breadcrumb is before "View" and after "Settings"
    if (
      name !== 'View' &&
      this.breadcrumbs[index + 1]?.name === 'View' &&
      this.breadcrumbs.some(breadcrumb => breadcrumb.name === 'Settings')
    ) {
      // Get the value of selectedComponentName from local storage
      const selectedComponentName = localStorage.getItem('selectedComponentName');

      if (selectedComponentName) {
        // Remove "Details" from selectedComponentName
        const updatedName = selectedComponentName.replace(' Details', '');

        // Store the updated name back in local storage
        localStorage.setItem('selectedComponentName', updatedName);
        this.afterActionService.reloadCurrentRoute();
      }
    }
  }
}
