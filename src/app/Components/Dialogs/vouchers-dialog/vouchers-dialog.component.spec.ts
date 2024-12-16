import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VouchersDialogComponent } from './vouchers-dialog.component';

describe('VouchersDialogComponent', () => {
  let component: VouchersDialogComponent;
  let fixture: ComponentFixture<VouchersDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VouchersDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VouchersDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
