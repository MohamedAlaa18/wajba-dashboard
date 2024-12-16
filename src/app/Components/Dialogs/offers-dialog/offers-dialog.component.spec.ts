import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OffersDialogComponent } from './offers-dialog.component';

describe('OffersDialogComponent', () => {
  let component: OffersDialogComponent;
  let fixture: ComponentFixture<OffersDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OffersDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OffersDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
