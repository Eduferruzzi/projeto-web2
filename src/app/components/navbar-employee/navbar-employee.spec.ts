import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarEmployee } from './navbar-employee';

describe('NavbarEmployee', () => {
  let component: NavbarEmployee;
  let fixture: ComponentFixture<NavbarEmployee>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavbarEmployee],
    }).compileComponents();

    fixture = TestBed.createComponent(NavbarEmployee);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
