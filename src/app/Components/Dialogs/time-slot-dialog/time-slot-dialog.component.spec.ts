import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeSlotDialogComponent } from './time-slot-dialog.component';

describe('TimeSlotDialogComponent', () => {
  let component: TimeSlotDialogComponent;
  let fixture: ComponentFixture<TimeSlotDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TimeSlotDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TimeSlotDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
