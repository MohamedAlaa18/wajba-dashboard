import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { IconComponent } from '../../../Components/Shared/icon/icon.component';
import { AfterActionService } from '../../../Services/AfterAction/after-action.service';
import { ILanguage } from '../../../Models/ilanguage';
import { LanguageDialogComponent } from "../../Dialogs/language-dialog/language-dialog.component";
import { LanguageService } from '../../../Services/Language/language.service';
import { ConfirmDeleteDialogComponent } from '../../Dialogs/confirm-delete-dialog/confirm-delete-dialog.component';

@Component({
  selector: 'app-languages',
  standalone: true,
  imports: [CommonModule, IconComponent, RouterModule, LanguageDialogComponent, ConfirmDeleteDialogComponent],
  templateUrl: './languages.component.html',
  styleUrl: './languages.component.scss'
})
export class LanguagesComponent implements OnInit {
  isModalOpen: boolean = false;
  isMenuOpen: boolean = false;
  languages: ILanguage[] = [];
  selectedLanguage: ILanguage | null = null;
  label: string = '';
  openDetails: boolean = false

  isConfirmDeleteModalOpen: boolean = false;
  languageToDeleteId!: number;

  constructor(
    private route: ActivatedRoute,
    private languageService: LanguageService,
    private afterActionService: AfterActionService
  ) { }

  ngOnInit(): void {
    this.getAllLanguages();

    this.route.url.subscribe((urlSegments) => {
      const path = urlSegments[0]?.path;
      if (path === 'settings') {
        this.label = 'Languages';
      }
    });
    this.selectedLanguage = this.languages[1];
  }

  getAllLanguages() {
    this.languageService.getAllLanguages().subscribe((response: any) => {
      if (response) {
        this.languages = response.data;
      } else {
        console.error('The response is not an array:', response);
        this.languages = [];
      }
    }, (error) => {
      console.error('Failed to load taxes:', error);
    });
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  openModal(action: string, tax: ILanguage | null) {
    this.selectedLanguage = tax;
    this.isModalOpen = true;
  }

  openConfirmDeleteModal(id: number) {
    this.languageToDeleteId = id;
    this.isConfirmDeleteModalOpen = true;
  }

  deleteLanguage() {
    if (this.languageToDeleteId) {
      this.languageService.deleteLanguage(this.languageToDeleteId).subscribe(() => {
        console.log(`Language with id: ${this.languageToDeleteId} deleted successfully.`);
        this.getAllLanguages();
        this.afterActionService.reloadCurrentRoute();
      }, (error) => {
        console.error('Failed to delete Language:', error);
      });
    }
  }

  openItemDetails(language: ILanguage) {
    localStorage.setItem('selectedLanguage', JSON.stringify(language));
    localStorage.setItem('selectedComponentName', 'Languages Details');
    this.afterActionService.reloadCurrentRoute();
  }

  closeDetails() {
    this.selectedLanguage = null;
    this.openDetails = false;
  }
}
