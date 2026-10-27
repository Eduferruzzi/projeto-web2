import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { LoginService } from './login.service';

describe('LoginService', () => {
  let service: LoginService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(LoginService);
    http = TestBed.inject(HttpTestingController);
    localStorage.clear();
  });

  afterEach(() => {
    http.verify();
    localStorage.clear();
  });

  it('returns the user when the API answers 200', () => {
    const usuario = { id: 2, nome: 'Funcionário', login: 'funcionario@gmail.com', perfil: 'FUNCIONARIO' };
    let resultado: unknown;

    service.login({ login: 'funcionario@gmail.com', senha: '4321' }).subscribe((u) => (resultado = u));
    http.expectOne('http://localhost:8081/login').flush(usuario);

    expect(resultado).toEqual(usuario);
  });

  it('returns null when the API answers 401', () => {
    let resultado: unknown = 'pendente';

    service.login({ login: 'funcionario@gmail.com', senha: 'errada' }).subscribe((u) => (resultado = u));
    http.expectOne('http://localhost:8081/login').flush(null, { status: 401, statusText: 'Unauthorized' });

    expect(resultado).toBeNull();
  });

  it('persists and clears the logged-in user', () => {
    const usuario = { id: 2, nome: 'Funcionário', login: 'funcionario@gmail.com', senha: '', perfil: 'FUNCIONARIO' };

    service.usuarioLogado = usuario;
    expect(service.usuarioLogado).toEqual(usuario);

    service.logout();
    expect(service.usuarioLogado).toBeNull();
  });
});
