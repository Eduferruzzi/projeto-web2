import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExecuteMaintenance } from './execute-maintenance';

describe('ExecuteMaintenance', () => {
  let component: ExecuteMaintenance;
  let fixture: ComponentFixture<ExecuteMaintenance>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExecuteMaintenance],
    }).compileComponents();

    fixture = TestBed.createComponent(ExecuteMaintenance);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
