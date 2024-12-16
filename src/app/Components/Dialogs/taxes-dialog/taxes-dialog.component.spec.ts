import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaxesDialogComponent } from './taxes-dialog.component';

describe('TaxesDialogComponent', () => {
  let component: TaxesDialogComponent;
  let fixture: ComponentFixture<TaxesDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaxesDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TaxesDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
