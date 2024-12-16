import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopularTodayDialogComponent } from './popular-today-dialog.component';

describe('PopularTodayDialogComponent', () => {
  let component: PopularTodayDialogComponent;
  let fixture: ComponentFixture<PopularTodayDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PopularTodayDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PopularTodayDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
