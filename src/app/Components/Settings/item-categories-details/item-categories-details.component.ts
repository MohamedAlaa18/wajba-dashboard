import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ICategoryItem } from '../../../Models/category-item';

@Component({
  selector: 'app-item-categories-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './item-categories-details.component.html',
  styleUrl: './item-categories-details.component.scss'
})
export class ItemCategoriesDetailsComponent implements OnInit {
  selectedCategory!: ICategoryItem;

  ngOnInit(): void {
    const savedCategory = localStorage.getItem('selectedCategory');
    if (savedCategory) {
      this.selectedCategory = JSON.parse(savedCategory);
    }
  }
}
