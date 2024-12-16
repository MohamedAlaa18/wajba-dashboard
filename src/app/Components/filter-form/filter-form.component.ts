import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-filter-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './filter-form.component.html',
  styleUrls: ['./filter-form.component.scss']
})
export class FilterFormComponent {
  @Input() filters: any = {};
  @Input() filterFields: { label: string, name: string, type: string, options?: string[] }[] = [];

  @Output() filterSubmit = new EventEmitter<any>();
  @Output() filterClear = new EventEmitter<void>();

  onSubmit() {
    this.filterSubmit.emit(this.filters);
  }

  onClear() {
    this.filters = {};
    this.filterClear.emit();
  }
}
