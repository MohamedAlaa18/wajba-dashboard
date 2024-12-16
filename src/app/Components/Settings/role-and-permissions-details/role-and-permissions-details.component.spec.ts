import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoleAndPermissionsDetailsComponent } from './role-and-permissions-details.component';

describe('RoleAndPermissionsDetailsComponent', () => {
  let component: RoleAndPermissionsDetailsComponent;
  let fixture: ComponentFixture<RoleAndPermissionsDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoleAndPermissionsDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RoleAndPermissionsDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
