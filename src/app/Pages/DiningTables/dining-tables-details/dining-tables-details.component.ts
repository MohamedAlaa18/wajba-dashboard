import { Component } from '@angular/core';
import { IDiningTable } from '../../../Models/itable';
import { DiningTableService } from '../../../Services/DiningTable/dining-table.service';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { BreadcrumbComponent } from '../../../Components/Shared/breadcrumb/breadcrumb.component';

@Component({
  selector: 'app-dining-tables-details',
  standalone: true,
  imports: [CommonModule,BreadcrumbComponent],
  templateUrl: './dining-tables-details.component.html',
  styleUrl: './dining-tables-details.component.scss'
})
export class DiningTablesDetailsComponent {
  diningTable!: IDiningTable;
  tableId!: number;

  constructor(
    private diningTableService: DiningTableService,
    private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.tableId = Number(this.activatedRoute.snapshot.paramMap.get('id'));

    this.fetchDiningTable(this.tableId);
  }

  fetchDiningTable(id: number) {
    this.diningTableService.getDiningTableById(id).subscribe(
      (response) => {
        this.diningTable = response.data;
        console.log('Dining Table:', this.diningTable);
      },
      (error) => {
        console.error('Error fetching dining table:', error);
      }
    );
  }
}
