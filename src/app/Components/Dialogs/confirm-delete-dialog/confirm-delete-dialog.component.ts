import { Component, EventEmitter, Input, Output } from '@angular/core';


@Component({
  selector: 'app-confirm-delete-dialog',
  standalone: true,
  imports: [],
  templateUrl: './confirm-delete-dialog.component.html',
  styleUrl: './confirm-delete-dialog.component.scss'
})
export class ConfirmDeleteDialogComponent {
  @Input() id!: number;
  @Input() name!: string;
  @Output() confirmDelete = new EventEmitter<number>();
  @Output() cancelDelete = new EventEmitter<void>();

  onConfirm() {
    this.confirmDelete.emit(this.id);
  }

  onCancel() {
    this.cancelDelete.emit();
  }
}
