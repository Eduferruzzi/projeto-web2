import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserAutoRegister } from './user-auto-register';

describe('UserAutoRegister', () => {
  let component: UserAutoRegister;
  let fixture: ComponentFixture<UserAutoRegister>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserAutoRegister],
    }).compileComponents();

    fixture = TestBed.createComponent(UserAutoRegister);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
