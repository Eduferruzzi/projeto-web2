import { vi } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, provideRouter, RouterStateSnapshot, UrlTree, GuardResult } from '@angular/router';
import { firstValueFrom, Observable } from 'rxjs';
import { authGuard } from './auth-guard';

describe('authGuard server session', () => {
  let http: HttpTestingController;
  const verificar = (role: string) => {
    const route = new ActivatedRouteSnapshot();
    route.data = { role };
    return firstValueFrom(TestBed.runInInjectionContext(() =>
      authGuard(route, { url: '/' } as RouterStateSnapshot)) as Observable<GuardResult>);
  };
  beforeEach(() => {
    const armazenamento = new Map<string, string>();
    vi.stubGlobal('localStorage', {
      getItem: (key: string) => armazenamento.get(key) ?? null,
      setItem: (key: string, value: string) => armazenamento.set(key, value),
      removeItem: (key: string) => armazenamento.delete(key),
      clear: () => armazenamento.clear()
    });
    TestBed.resetTestingModule();
    localStorage.clear();
    TestBed.configureTestingModule({ providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()] });
    http = TestBed.inject(HttpTestingController);
  });
  afterEach(() => { http.verify(); localStorage.clear(); TestBed.resetTestingModule(); vi.unstubAllGlobals(); });

  it('allows the profile confirmed by the server with no local user', async () => {
    const resultado = verificar('FUNCIONARIO');
    http.expectOne('http://localhost:8080/sessao').flush({ id: 30, perfil: 'FUNCIONARIO' });
    expect(await resultado).toBe(true);
  });

  it('rejects an expired session despite a stored employee profile', async () => {
    localStorage.setItem('usuarioLogado', JSON.stringify({ id: 30, perfil: 'FUNCIONARIO' }));
    const resultado = verificar('FUNCIONARIO');
    http.expectOne('http://localhost:8080/sessao').flush(null, { status: 401, statusText: 'Unauthorized' });
    expect((await resultado as UrlTree).toString()).toBe('/login');
    expect(localStorage.getItem('usuarioLogado')).toBeNull();
  });

  it('uses the server profile instead of a forged local profile', async () => {
    localStorage.setItem('usuarioLogado', JSON.stringify({ id: 30, perfil: 'FUNCIONARIO' }));
    const resultado = verificar('FUNCIONARIO');
    http.expectOne('http://localhost:8080/sessao').flush({ id: 10, perfil: 'CLIENTE' });
    expect((await resultado as UrlTree).toString()).toBe('/login');
    expect(JSON.parse(localStorage.getItem('usuarioLogado')!).usuario.perfil).toBe('CLIENTE');
  });

  it('rejects an employee accessing client routes', async () => {
    const resultado = verificar('CLIENTE');
    http.expectOne('http://localhost:8080/sessao').flush({ id: 30, perfil: 'FUNCIONARIO' });
    expect((await resultado as UrlTree).toString()).toBe('/login');
  });

  it('denies access with an explanatory message on server failure', async () => {
    const resultado = verificar('FUNCIONARIO');
    http.expectOne('http://localhost:8080/sessao').flush(null, { status: 500, statusText: 'Server Error' });
    const url = await resultado as UrlTree;
    expect(url.queryParams['error']).toContain('verificar sua sessao');
    expect(url.toString()).toContain('/login');
  });

  it('denies access when the connection is unavailable', async () => {
    const resultado = verificar('CLIENTE');
    http.expectOne('http://localhost:8080/sessao').error(new ProgressEvent('error'));
    expect((await resultado as UrlTree).queryParams['error']).toContain('verificar sua sessao');
  });
});
