import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddonsDialogComponent } from './addons-dialog.component';

describe('AddonsDialogComponent', () => {
  let component: AddonsDialogComponent;
  let fixture: ComponentFixture<AddonsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddonsDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddonsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
