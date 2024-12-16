import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { IconComponent } from '../../../Components/Shared/icon/icon.component';
import { ITax } from '../../../Models/itax';
import { TaxesDialogComponent } from '../../Dialogs/taxes-dialog/taxes-dialog.component';
import { TaxService } from '../../../Services/Tax/tax.service';
import { AfterActionService } from '../../../Services/AfterAction/after-action.service';
import { ConfirmDeleteDialogComponent } from '../../Dialogs/confirm-delete-dialog/confirm-delete-dialog.component';

@Component({
  selector: 'app-taxes',
  standalone: true,
  imports: [CommonModule, IconComponent, TaxesDialogComponent, RouterModule,ConfirmDeleteDialogComponent],
  templateUrl: './taxes.component.html',
  styleUrls: ['./taxes.component.scss']
})
export class TaxesComponent implements OnInit {
  isFilterVisible: boolean = false;
  isModalOpen: boolean = false;
  isMenuOpen: boolean = false;
  filteredTaxes: ITax[] = [];
  taxes: ITax[] = []; // Initialize as an empty array
  selectedTax: ITax | null = null;
  taxLabel: string = '';

  isConfirmDeleteModalOpen: boolean = false;
  taxToDeleteId!: number;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private taxService: TaxService,
    private afterActionService: AfterActionService
  ) { }

  ngOnInit(): void {
    // Fetch all taxes on component initialization
    this.getAllTaxes();

    // Subscribe to route changes and adjust labels based on the path
    this.route.url.subscribe((urlSegments) => {
      const path = urlSegments[0]?.path;
      if (path === 'settings') {
        this.taxLabel = 'Taxes';
      }
    });
  }

  getAllTaxes() {
    this.taxService.getAllTax().subscribe((response: any) => {
      if (response) {
        this.taxes = response.data;
      } else {
        console.error('The response is not an array:', response);
        this.taxes = [];
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

  openModal(action: string, tax: ITax | null) {
    this.selectedTax = tax; // Assign the selected tax for editing
    this.isModalOpen = true; // Open the modal
  }

  openConfirmDeleteModal(id: number) {
    this.taxToDeleteId = id;
    this.isConfirmDeleteModalOpen = true;
  }

  deleteTax() {
    if (this.taxToDeleteId) {
      this.taxService.deleteTax(this.taxToDeleteId).subscribe(() => {
        console.log(`Tax with id: ${this.taxToDeleteId} deleted successfully.`);
        // Optionally, you can reload the list of taxes after deletion
        this.getAllTaxes();
        this.afterActionService.reloadCurrentRoute();
      }, (error) => {
        console.error('Failed to delete tax:', error);
      });
    }
  }
}
