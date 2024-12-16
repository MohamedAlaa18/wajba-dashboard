import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-details-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './details-table.component.html',
  styleUrl: './details-table.component.scss'
})
export class DetailsTableComponent {
  @Input() tableTitle: string = '';
  @Input() tableHeaders: string[] = [];
  @Input() tableData: any[] = [];
  @Input() actions: { edit: Function, delete: Function } = { edit: () => { }, delete: () => { } };

  get hasStatusHeader(): boolean {
    return this.tableHeaders.includes('Status');
  }
}
