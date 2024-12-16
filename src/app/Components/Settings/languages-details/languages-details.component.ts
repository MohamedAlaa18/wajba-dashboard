import { Component } from '@angular/core';
import { ILanguage } from '../../../Models/ilanguage';

@Component({
  selector: 'app-languages-details',
  standalone: true,
  imports: [],
  templateUrl: './languages-details.component.html',
  styleUrl: './languages-details.component.scss'
})
export class LanguagesDetailsComponent {
  selectedLanguage!: ILanguage;

  ngOnInit(): void {
    const savedLanguage = localStorage.getItem('selectedLanguage');
    if (savedLanguage) {
      this.selectedLanguage = JSON.parse(savedLanguage);
    }
  }
}
