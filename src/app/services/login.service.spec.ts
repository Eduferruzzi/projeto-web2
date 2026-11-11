import { vi } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { LoginService } from './login.service';

describe('LoginService', () => {
  let service: LoginService;
  let http: HttpTestingController;

  beforeEach(() => {
    const armazenamento = new Map<string, string>();
    vi.stubGlobal('localStorage', {
      getItem: (key: string) => armazenamento.get(key) ?? null,
      setItem: (key: string, value: string) => armazenamento.set(key, value),
      removeItem: (key: string) => armazenamento.delete(key),
      clear: () => armazenamento.clear()
    });
    TestBed.resetTestingModule();
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
    TestBed.resetTestingModule();
    vi.unstubAllGlobals();
  });

  it('returns the user when the API answers 200', () => {
    const usuario = { id: 2, nome: 'Funcionário', login: 'funcionario@gmail.com', perfil: 'FUNCIONARIO' };
    let resultado: unknown;

    service.login({ login: 'funcionario@gmail.com', senha: '4321' }).subscribe((u) => (resultado = u));
    http.expectOne('http://localhost:8080/login').flush(usuario);

    expect(resultado).toEqual(usuario);
  });

  it('returns null when the API answers 401', () => {
    let resultado: unknown = 'pendente';

    service.login({ login: 'funcionario@gmail.com', senha: 'errada' }).subscribe((u) => (resultado = u));
    http.expectOne('http://localhost:8080/login').flush(null, { status: 401, statusText: 'Unauthorized' });

    expect(resultado).toBeNull();
  });

  it('persists and clears the logged-in user', () => {
    const usuario = { id: 2, nome: 'Funcionário', login: 'funcionario@gmail.com', senha: '', perfil: 'FUNCIONARIO' };

    service.usuarioLogado = usuario;
    expect(service.usuarioLogado).toEqual(usuario);

    service.logout().subscribe();
    const logout = http.expectOne('http://localhost:8080/logout');
    expect(logout.request.withCredentials).toBe(true);
    logout.flush(null, { status: 204, statusText: 'No Content' });
    expect(service.usuarioLogado).toBeNull();
  });

  it('restores the server session without requiring local storage', () => {
    const usuario = { id: 10, nome: 'Cliente', login: 'cliente@teste.local', perfil: 'CLIENTE' };
    let resultado: unknown;
    service.consultarSessao().subscribe(u => resultado = u);
    const req = http.expectOne('http://localhost:8080/sessao');
    expect(req.request.withCredentials).toBe(true);
    req.flush(usuario);
    expect(resultado).toEqual(usuario);
    expect(service.usuarioLogado).toEqual(usuario);
  });

  it('clears stale user data when the session expires', () => {
    localStorage.setItem('usuarioLogado', JSON.stringify({ id: 30, perfil: 'FUNCIONARIO' }));
    let resultado: unknown = 'pendente';
    service.consultarSessao().subscribe(u => resultado = u);
    http.expectOne('http://localhost:8080/sessao').flush(null, { status: 401, statusText: 'Unauthorized' });
    expect(resultado).toBeNull();
    expect(localStorage.getItem('usuarioLogado')).toBeNull();
  });

  it('propagates server failures without treating the session as expired', () => {
    localStorage.setItem('usuarioLogado', JSON.stringify({ id: 30, perfil: 'FUNCIONARIO' }));
    let erro: any;
    service.consultarSessao().subscribe({ error: e => erro = e });
    http.expectOne('http://localhost:8080/sessao').flush(null, { status: 500, statusText: 'Server Error' });
    expect(erro.status).toBe(500);
    expect(localStorage.getItem('usuarioLogado')).not.toBeNull();
  });

  it('does not turn a login connection failure into invalid credentials', () => {
    let erro: any;
    service.login({ login: 'teste', senha: 'teste' }).subscribe({ error: e => erro = e });
    http.expectOne('http://localhost:8080/login').error(new ProgressEvent('error'));
    expect(erro.status).toBe(0);
  });
});
