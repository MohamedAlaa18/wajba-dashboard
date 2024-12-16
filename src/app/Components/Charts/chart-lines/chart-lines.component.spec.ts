import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartLinesComponent } from './chart-lines.component';

describe('ChartLinesComponent', () => {
  let component: ChartLinesComponent;
  let fixture: ComponentFixture<ChartLinesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChartLinesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChartLinesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
