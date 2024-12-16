import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { IconComponent } from '../../../Components/Shared/icon/icon.component';
import { AfterActionService } from '../../../Services/AfterAction/after-action.service';
import { AnalyticsComponent } from "../analytics/analytics.component";
import { ICurrency } from '../../../Models/icurrency';
import { CurrencyService } from '../../../Services/Currency/currency.service';
import { CurrencyDialogComponent } from "../../Dialogs/currency-dialog/currency-dialog.component";
import { ConfirmDeleteDialogComponent } from '../../Dialogs/confirm-delete-dialog/confirm-delete-dialog.component';

@Component({
  selector: 'app-currencies',
  standalone: true,
  imports: [CommonModule, IconComponent, RouterModule, AnalyticsComponent, CurrencyDialogComponent, ConfirmDeleteDialogComponent],
  templateUrl: './currencies.component.html',
  styleUrl: './currencies.component.scss'
})
export class CurrenciesComponent implements OnInit {
  isModalOpen: boolean = false;
  isMenuOpen: boolean = false;
  currencies: ICurrency[] = [];
  selectedCurrency: ICurrency | null = null;
  label: string = '';

  isConfirmDeleteModalOpen: boolean = false;
  currencyToDeleteId!: number;

  constructor(
    private route: ActivatedRoute,
    private currencyService: CurrencyService,
    private afterActionService: AfterActionService
  ) { }

  ngOnInit(): void {
    this.getAllCurrencies();

    this.route.url.subscribe((urlSegments) => {
      const path = urlSegments[0]?.path;
      if (path === 'settings') {
        this.label = 'Currencies';
      }
    });
  }

  getAllCurrencies() {
    this.currencyService.getAllCurrencies().subscribe((response: any) => {
      if (response) {
        this.currencies = response.data;
        console.log("currency : " + response.data)
      } else {
        console.error('The response is not an array:', response);
        this.currencies = [];
      }
    }, (error) => {
      console.error('Failed to load currencies:', error);
    });
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  openModal(action: string, tax: ICurrency | null) {
    this.selectedCurrency = tax;
    this.isModalOpen = true;
  }

  openConfirmDeleteModal(id: number) {
    this.currencyToDeleteId = id;
    this.isConfirmDeleteModalOpen = true;
  }

  deleteCurrency() {
    if (this.currencyToDeleteId) {
      this.currencyService.deleteCurrency(this.currencyToDeleteId).subscribe(() => {
        console.log(`Currency with id: ${this.currencyToDeleteId} deleted successfully.`);
        this.afterActionService.reloadCurrentRoute();
      }, (error) => {
        console.error('Failed to delete currency:', error);
      });
    }
  }
}
