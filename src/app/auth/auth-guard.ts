import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { readAuthenticatedUser } from './auth-session';

export const authGuard: CanActivateFn = (route) => {
  const router = inject(Router);
  const usuario = readAuthenticatedUser();

  if (!usuario) {
    return router.createUrlTree(['/login']);
  }

  const perfil = route.data?.['role'];

  if (perfil && usuario.perfil !== perfil) {
    return router.createUrlTree(['/login']);
  }

  return true;
};
