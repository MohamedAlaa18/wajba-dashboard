import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExtraDialogComponent } from './extra-dialog.component';

describe('ExtraDialogComponent', () => {
  let component: ExtraDialogComponent;
  let fixture: ComponentFixture<ExtraDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExtraDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExtraDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
