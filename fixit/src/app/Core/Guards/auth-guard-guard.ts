import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth } from '../Services/auth';

export const authGuardGuard: CanActivateFn = () => {
  const router =inject(Router);
  const auth=inject(Auth);
 if(auth.userToken())
  return true;
else
{
  router.navigate(['/']);
return false;
}
};
