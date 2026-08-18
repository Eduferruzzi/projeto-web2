import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CRUDemployee } from './crudemployee';

describe('CRUDemployee', () => {
  let component: CRUDemployee;
  let fixture: ComponentFixture<CRUDemployee>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CRUDemployee],
    }).compileComponents();

    fixture = TestBed.createComponent(CRUDemployee);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
