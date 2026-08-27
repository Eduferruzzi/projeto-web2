import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaintenanceRequest } from './maintenance-request';

describe('MaintenanceRequest', () => {
  let component: MaintenanceRequest;
  let fixture: ComponentFixture<MaintenanceRequest>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MaintenanceRequest],
    }).compileComponents();

    fixture = TestBed.createComponent(MaintenanceRequest);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
