import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { IconComponent } from '../../../Components/Shared/icon/icon.component';
import { AfterActionService } from '../../../Services/AfterAction/after-action.service';
import { IAttribute } from '../../../Models/item';
import { AttributeService } from '../../../Services/Attribute/attribute.service';
import { AttributeDialogComponent } from '../../Dialogs/attribute-dialog/attribute-dialog.component';
import { AnalyticsComponent } from "../analytics/analytics.component";
import { ConfirmDeleteDialogComponent } from '../../Dialogs/confirm-delete-dialog/confirm-delete-dialog.component';

@Component({
  selector: 'app-item-attributes',
  standalone: true,
  imports: [CommonModule, IconComponent, AttributeDialogComponent, RouterModule, AnalyticsComponent, ConfirmDeleteDialogComponent],
  templateUrl: './item-attributes.component.html',
  styleUrl: './item-attributes.component.scss'
})
export class ItemAttributesComponent implements OnInit {
  isFilterVisible: boolean = false;
  isModalOpen: boolean = false;
  isMenuOpen: boolean = false;
  attributes: IAttribute[] = [];
  selectedAttribute: IAttribute | null = null;
  label: string = '';

  isConfirmDeleteModalOpen: boolean = false;
  attributeToDeleteId!: number;

  constructor(
    private route: ActivatedRoute,
    private attributeService: AttributeService,
    private afterActionService: AfterActionService
  ) { }

  ngOnInit(): void {
    // Fetch all taxes on component initialization
    this.getItemAttributes();

    // Subscribe to route changes and adjust labels based on the path
    this.route.url.subscribe((urlSegments) => {
      const path = urlSegments[0]?.path;
      if (path === 'settings') {
        this.label = 'Item Attribute';
      }
    });
  }

  getItemAttributes() {
    this.attributeService.getItemAttributes().subscribe((response: any) => {
      if (response) {
        this.attributes = response.message;
        console.log("attribute : " + response)
      } else {
        console.error('The response is not an array:', response);
        this.attributes = [];
      }
    }, (error) => {
      console.error('Failed to load item attribute:', error);
    });
  }

  toggleFilterVisibility() {
    this.isFilterVisible = !this.isFilterVisible;
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  openModal(action: string, tax: IAttribute | null) {
    this.selectedAttribute = tax;
    this.isModalOpen = true;
  }

  openConfirmDeleteModal(id: number) {
    this.attributeToDeleteId = id;
    this.isConfirmDeleteModalOpen = true;
  }

  deleteAttribute() {
    if (this.attributeToDeleteId) {
      this.attributeService.deleteItemAttribute(this.attributeToDeleteId).subscribe(() => {
        console.log(`item attribute with id: ${this.attributeToDeleteId} deleted successfully.`);
        this.afterActionService.reloadCurrentRoute();
        this.isConfirmDeleteModalOpen = false;
      }, (error) => {
        console.error('Failed to delete item attribute:', error);
      });
    }
  }
}
