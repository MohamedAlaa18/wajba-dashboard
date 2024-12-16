import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DetailsTableComponent } from '../details-table/details-table.component';
import { VariationDialogComponent } from '../../../../Components/Dialogs/variation-dialog/variation-dialog.component';
import { ExtraDialogComponent } from '../../../../Components/Dialogs/extra-dialog/extra-dialog.component';
import { AddonsDialogComponent } from '../../../../Components/Dialogs/addons-dialog/addons-dialog.component';
import { IItem } from '../../../../Models/item';
import { ItemsService } from '../../../../Services/Items/items.service';
import { VariationService } from '../../../../Services/Variation/variation.service';
import { ExtraService } from '../../../../Services/Extra/extra.service';
import { AddonsService } from '../../../../Services/Addons/addons.service';
import { AfterActionService } from '../../../../Services/AfterAction/after-action.service';
import { PopularTodayService } from '../../../../Services/PopularToday/popular-today.service';
import { BreadcrumbComponent } from '../../../../Components/Shared/breadcrumb/breadcrumb.component';

@Component({
  selector: 'app-item-details',
  standalone: true,
  imports: [CommonModule, DetailsTableComponent, VariationDialogComponent, ExtraDialogComponent, AddonsDialogComponent, BreadcrumbComponent],
  templateUrl: './item-details.component.html',
  styleUrl: './item-details.component.scss',
})
export class ItemDetailsComponent implements OnInit {
  activeSection: string = 'information';
  showVariationModal = false;
  showExtraModal = false;
  showAddonsModal = false;
  itemId!: number;
  item!: IItem;
  isPopularRoute = false;
  selectedVariation: any = null;
  selectedExtra: any = null;
  selectedAddon: any = null;
  selectedFileName: string | null = null;
  selectedFile: File | null = null;

  variations: any[] = [];
  extras: any[] = [];
  addons: any[] = [];

  constructor(
    private itemService: ItemsService,
    private variationService: VariationService,
    private extraService: ExtraService,
    private addonsService: AddonsService,
    private activatedRoute: ActivatedRoute,
    private afterActionService: AfterActionService,
    private popularTodayService: PopularTodayService
  ) {
    this.itemId = Number(this.activatedRoute.snapshot.paramMap.get('id'));
    this.isPopularRoute = this.activatedRoute.snapshot.routeConfig?.path === 'popular/:id';
  }

  ngOnInit(): void {
    this.activeSection = localStorage.getItem('activeSection') || 'information';
    this.fetchItem();
  }

  setActiveSection(section: string): void {
    this.activeSection = section;
    localStorage.setItem('activeSection', section);
  }

  fetchItem(): void {
    if (this.isPopularRoute) {
      this.popularTodayService.getPopularItemById(this.itemId).subscribe(
        (response) => {
          this.item = response.data;
          console.log(response);
          if (this.item.itemId) {
            this.fetchVariations(this.item.itemId);
            this.fetchExtras(this.item.itemId);
            this.fetchAddons(this.item.itemId);
          }
        },
        (error) => {
          console.error('Error fetching popular items:', error);
        }
      );
    } else {
      this.itemService.getItemById(this.itemId).subscribe(
        (response) => {
          this.item = response.data;
          console.log(response);
          this.fetchVariations(this.item.id);
          this.fetchExtras(this.item.id);
          this.fetchAddons(this.item.id);
        },
        (error) => {
          console.error('Error fetching item:', error);
        }
      );
    }
  }

  fetchVariations(id: number): void {
    this.variationService.getAllVariationsForItem(id).subscribe(
      (response) => {
        this.variations = response.data;
        console.log(response)
      },
      (error) => {
        console.error('Error fetching variations:', error);
      }
    );
  }

  fetchExtras(id: number): void {
    this.extraService.getExtraById(id).subscribe(
      (data) => {
        this.extras = data.data;
      },
      (error) => {
        console.error('Error fetching extras:', error);
      }
    );
  }

  fetchAddons(id: number): void {
    this.addonsService.getItemAddons(id).subscribe(
      (response) => {
        this.addons = response;
        console.log(response)
      },
      (error) => {
        console.error('Error fetching addons:', error);
      }
    );
  }

  openVariationModal(variation: any = null) {
    this.selectedVariation = variation;
    this.showVariationModal = true;
  }

  openExtraModal(extra: any = null) {
    this.selectedExtra = extra;
    this.showExtraModal = true;
  }

  openAddonsModal(addon: any = null) {
    this.selectedAddon = addon;
    this.showAddonsModal = true;
  }

  editVariation(variation: any) {
    this.openVariationModal(variation);
  }

  editExtra(extra: any) {
    this.openExtraModal(extra);
  }

  editAddon(addon: any) {
    this.openAddonsModal(addon);
  }

  deleteExtra(extra: any) {
    if (confirm('Are you sure you want to delete this item?')) {
      this.extraService.deleteExtra(extra.id, this.itemId).subscribe(() => {
        console.log(`Item with id ${extra.id} deleted successfully.`);
        // Refresh the items list after deletion
        this.afterActionService.reloadCurrentRoute();
      }, (error) => {
        console.error(`Error deleting item with id ${extra.id}:`, error);
      });
    }
  }

  deleteAddon(addon: any) {
    if (confirm('Are you sure you want to delete this item?')) {
      this.addonsService.deleteItemAddon(addon.id, this.itemId).subscribe(() => {
        console.log(`Item with id ${addon.id} deleted successfully.`);
        // Refresh the items list after deletion
        this.afterActionService.reloadCurrentRoute();
      }, (error) => {
        console.error(`Error deleting item with id ${addon.id}:`, error);
      });
    }
  }

  deleteVariation(variation: any) {
    if (confirm('Are you sure you want to delete this variation?')) {
      this.variationService.deleteVariation(variation.itemattributesId, this.itemId).subscribe((response) => {
        console.log(`Variation with id ${variation.itemattributesId} deleted successfully.`, response);
        this.afterActionService.reloadCurrentRoute();
      }, (error) => {
        console.error(`Error deleting variation with id ${variation.itemattributesId}:`, error);
      });
    }
  }

  onFileSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFileName = input.files[0].name;
      this.selectedFile = input.files[0];
      this.updateItemImage(); // Call the image update method after selecting the file
    } else {
      this.selectedFileName = null;
      this.selectedFile = null;
    }
  }

  updateItemImage(): void {
    if (this.selectedFile) {
      if (this.isPopularRoute) {
        // Use updatePopularItemImage from PopularTodayService
        this.popularTodayService.updatePopularItemImage(this.itemId, this.selectedFile).subscribe(
          (response) => {
            console.log('Popular item image updated successfully:', response);
            this.afterActionService.reloadCurrentRoute();
          },
          (error) => {
            console.error('Error updating popular item image:', error);
          }
        );
      } else {
        // Use ItemsService for normal items
        this.itemService.updateItemImage(this.itemId, this.selectedFile).subscribe(
          (response) => {
            console.log('Image updated successfully:', response);
            this.afterActionService.reloadCurrentRoute();
          },
          (error) => {
            console.error('Error updating image:', error);
          }
        );
      }
    }
  }
}
