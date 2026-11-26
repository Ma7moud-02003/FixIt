import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth } from '../Services/auth';

export const roleGuard: CanActivateFn = (route) => {
  const auth = inject(Auth);
  const router = inject(Router);
  const role = auth.getRole()?.toLowerCase();
  const allowedRoles: string[] = route.data?.['roles'] ?? [];
  if (role && allowedRoles.some(r => r.toLowerCase() === role))
    return true;
  router.navigate(['/']);
  return false;
};
