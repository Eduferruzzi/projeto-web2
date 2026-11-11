import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { catchError, map, of } from 'rxjs';
import { LoginService } from '../services/login.service';

export const authGuard: CanActivateFn = (route) => {
  const router = inject(Router);
  const loginService = inject(LoginService);

  return loginService.consultarSessao().pipe(
    map(usuario => {
      if (!usuario) {
        return router.createUrlTree(['/login']);
      }
      const perfil = route.data?.['role'];
      if (perfil && usuario.perfil !== perfil) {
        return router.createUrlTree(['/login']);
      }
      return true;
    }),
    catchError(() => of(router.createUrlTree(['/login'], {
      queryParams: { error: 'Nao foi possivel verificar sua sessao. Tente novamente.' }
    })))
  );
};
