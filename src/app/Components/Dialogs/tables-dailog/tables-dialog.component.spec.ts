import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TablesDialogComponent } from './tables-dialog.component';

describe('TablesDialogComponent', () => {
  let component: TablesDialogComponent;
  let fixture: ComponentFixture<TablesDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TablesDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TablesDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
