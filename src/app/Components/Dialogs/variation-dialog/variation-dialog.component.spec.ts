import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VariationDialogComponent } from './variation-dialog.component';

describe('VariationDialogComponent', () => {
  let component: VariationDialogComponent;
  let fixture: ComponentFixture<VariationDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VariationDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VariationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
