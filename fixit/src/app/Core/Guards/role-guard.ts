import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth } from '../Services/auth';

export const roleGuard: CanActivateFn = (route) => {
  const auth=inject(Auth);
  const router=inject(Router)
  const role=auth.getRole();
  const allowedRoles=route.data['roles'];
  if(allowedRoles.includes(role))
  return true;
  else
    router.navigate(['/']);
  return false
};
