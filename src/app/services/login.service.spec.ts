import { TestBed } from '@angular/core/testing';
import { LoginService } from './login.service';

describe('LoginService fixed employee profile', () => {
  let service: LoginService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoginService);
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
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

  it('authenticates the fixed customer profile', () => {
    service.login({ login: 'cliente@gmail.com', senha: '1234' }).subscribe((usuario) => {
      expect(usuario).toEqual({
        id: 1,
        nome: 'Cliente',
        login: 'cliente@gmail.com',
        senha: '1234',
        perfil: 'CLIENTE',
      });
    });
  });

  it('rejects invalid employee credentials', () => {
    service.login({ login: 'funcionario@gmail.com', senha: '1234' }).subscribe((usuario) => {
      expect(usuario).toBeNull();
    });
  });

  it('persists and clears the logged-in user', () => {
    const usuario = {
      id: 2,
      nome: 'Funcionário',
      login: 'funcionario@gmail.com',
      senha: '4321',
      perfil: 'FUNCIONARIO',
    };

    service.usuarioLogado = usuario;
    expect(service.usuarioLogado).toEqual(usuario);

    service.logout();
    expect(service.usuarioLogado).toBeNull();
  });
});
