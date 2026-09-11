import { TestBed } from '@angular/core/testing';

import { CatEquipService } from './cat-equip-service';

describe('CatEquipService', () => {
  let service: CatEquipService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CatEquipService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
