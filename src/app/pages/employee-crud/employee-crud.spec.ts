import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { CRUDemployee } from './employee-crud';
import { FuncionarioService } from '../../services/funcionario-service';

describe('CRUDemployee', () => {
  let component: CRUDemployee;
  let fixture: ComponentFixture<CRUDemployee>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CRUDemployee],
      providers: [{
        provide: FuncionarioService,
        useValue: {
          listar: () => of([]),
          criar: () => of({ id: 1, nome: 'Teste', email: 'teste@example.com', dataNascimento: '1990-01-01' }),
          atualizar: () => of({ id: 1, nome: 'Teste', email: 'teste@example.com', dataNascimento: '1990-01-01' }),
          desativar: () => of(undefined)
        }
      }]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CRUDemployee);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
