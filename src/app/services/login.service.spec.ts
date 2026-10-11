import { TestBed } from '@angular/core/testing';
import { LoginService } from './login.service';

describe('LoginService fixed employee profile', () => {
  let service: LoginService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoginService);
  });

  it('authenticates the fixed employee profile', () => {
    service.login({ login: 'funcionario@gmail.com', senha: '4321' }).subscribe((usuario) => {
      expect(usuario).toEqual({
        id: 2,
        nome: 'Funcionário',
        login: 'funcionario@gmail.com',
        senha: '4321',
        perfil: 'FUNCIONARIO',
      });
    });
  });

  it('rejects invalid employee credentials', () => {
    service.login({ login: 'funcionario@gmail.com', senha: '1234' }).subscribe((usuario) => {
      expect(usuario).toBeNull();
    });
  });
});
