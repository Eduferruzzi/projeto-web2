import { TestBed } from '@angular/core/testing';
import {
  ActivatedRouteSnapshot,
  provideRouter,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { authGuard } from './auth-guard';

describe('authGuard role access', () => {
  const routeFor = (role: string): ActivatedRouteSnapshot => {
    const route = new ActivatedRouteSnapshot();
    route.data = { role };
    return route;
  };
  const state = { url: '/' } as RouterStateSnapshot;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
  });

  it('allows the fixed employee profile into employee routes', () => {
    localStorage.setItem('usuarioLogado', JSON.stringify({ perfil: 'FUNCIONARIO' }));

    const result = TestBed.runInInjectionContext(() =>
      authGuard(routeFor('FUNCIONARIO'), state)
    );

    expect(result).toBe(true);
  });

  it('redirects an employee away from client routes', () => {
    localStorage.setItem('usuarioLogado', JSON.stringify({ perfil: 'FUNCIONARIO' }));

    const result = TestBed.runInInjectionContext(() =>
      authGuard(routeFor('CLIENTE'), state)
    );

    expect(result).toBeInstanceOf(UrlTree);
    expect((result as UrlTree).toString()).toContain('/login');
  });

  it('redirects a client away from employee routes', () => {
    localStorage.setItem('usuarioLogado', JSON.stringify({ perfil: 'CLIENTE' }));

    const result = TestBed.runInInjectionContext(() =>
      authGuard(routeFor('FUNCIONARIO'), state)
    );

    expect(result).toBeInstanceOf(UrlTree);
    expect((result as UrlTree).toString()).toContain('/login');
  });
});
