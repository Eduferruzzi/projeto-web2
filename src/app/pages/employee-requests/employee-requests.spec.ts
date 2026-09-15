import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeRequests } from './employee-requests';

describe('EmployeeRequests', () => {
  let component: EmployeeRequests;
  let fixture: ComponentFixture<EmployeeRequests>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeeRequests],
    }).compileComponents();

    fixture = TestBed.createComponent(EmployeeRequests);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
