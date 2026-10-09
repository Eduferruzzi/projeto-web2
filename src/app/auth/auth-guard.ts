import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route) => {
  const router = inject(Router);
  const usuarioSalvo = localStorage.getItem('usuarioLogado');

  if (!usuarioSalvo) {
    return router.createUrlTree(['/login']);
  }

  const usuario = JSON.parse(usuarioSalvo);
  const perfil = route.data?.['role'];

  if (perfil && usuario.perfil !== perfil) {
    return router.createUrlTree(['/login']);
  }

  return true;
};
