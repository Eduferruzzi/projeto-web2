import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter, Router } from '@angular/router';
import { vi } from 'vitest';
import { NgForm } from '@angular/forms';
import { Login } from './login';

describe('Login session verification', () => {
  let fixture: ComponentFixture<Login>;
  let component: Login;
  let http: HttpTestingController;
  let navigate: ReturnType<typeof vi.spyOn>;
  beforeEach(async () => {
    const armazenamento = new Map<string, string>();
    vi.stubGlobal('localStorage', {
      getItem: (key: string) => armazenamento.get(key) ?? null,
      setItem: (key: string, value: string) => armazenamento.set(key, value),
      removeItem: (key: string) => armazenamento.delete(key),
      clear: () => armazenamento.clear()
    });
    TestBed.resetTestingModule();
    localStorage.clear();
    await TestBed.configureTestingModule({ imports: [Login],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()] }).compileComponents();
    http = TestBed.inject(HttpTestingController);
    navigate = vi.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(true);
    fixture = TestBed.createComponent(Login);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  afterEach(() => { http.verify(); localStorage.clear(); TestBed.resetTestingModule(); vi.unstubAllGlobals(); vi.restoreAllMocks(); });

  it('checks the session before redirecting an existing employee', () => {
    expect(navigate).not.toHaveBeenCalled();
    expect(component.loading()).toBe(true);
    http.expectOne('http://localhost:8080/sessao').flush({ id: 30, perfil: 'FUNCIONARIO' });
    expect(navigate).toHaveBeenCalledWith(['/employee-home']);
    expect(component.loading()).toBe(false);
  });

  it('restores a customer session even with no local user', () => {
    http.expectOne('http://localhost:8080/sessao').flush({ id: 10, perfil: 'CLIENTE' });
    expect(navigate).toHaveBeenCalledWith(['/user-home']);
  });

  it('keeps the login form available when the session has expired', () => {
    http.expectOne('http://localhost:8080/sessao').flush(null, { status: 401, statusText: 'Unauthorized' });
    expect(navigate).not.toHaveBeenCalled();
    expect(component.loading()).toBe(false);
    expect(component.message()).toBe('');
  });

  it('shows a session verification error without redirecting', () => {
    http.expectOne('http://localhost:8080/sessao').flush(null, { status: 500, statusText: 'Server Error' });
    expect(navigate).not.toHaveBeenCalled();
    expect(component.message()).toContain('verificar sua sessao');
    expect(component.loading()).toBe(false);
  });

  it('shows a connection error separately from invalid credentials', () => {
    http.expectOne('http://localhost:8080/sessao').flush(null, { status: 401, statusText: 'Unauthorized' });
    component.formLogin = { form: { valid: true } } as NgForm;
    component.fazerLogin();
    http.expectOne('http://localhost:8080/login').error(new ProgressEvent('error'));
    expect(component.message()).toContain('conectar ao servidor');
    expect(component.loading()).toBe(false);
    expect(navigate).not.toHaveBeenCalled();
  });
});
