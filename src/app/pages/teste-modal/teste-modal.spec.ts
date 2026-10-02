import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TesteModal } from './teste-modal';

describe('TesteModal', () => {
  let component: TesteModal;
  let fixture: ComponentFixture<TesteModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TesteModal],
    }).compileComponents();

    fixture = TestBed.createComponent(TesteModal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
