import { inject, Injectable, OnDestroy } from '@angular/core';
import Swal from 'sweetalert2'
import { User } from '../../Core/Services/user';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class Alerts implements OnDestroy{
private router=inject(Router);  
private user=inject(User);
private subs=new Subscription();
  sucsess(message:string)
  {
    Swal.fire({
  title: message,
  icon: "success",
  draggable: true
});
  }

  error(message:string)
  {
    Swal.fire({
  title: `${message}`,
  icon: "error",
  draggable: true
});
  }

confirmDelete(message: string) {
  return Swal.fire({
    title: "هل انت متأكد ؟",
    text: message,
    icon:'warning',
    showCancelButton: true,
    confirmButtonText: 'نعم احذف نهائيا',
    cancelButtonText: 'الغاء',
    confirmButtonColor: "red",
    reverseButtons: true
  });
}

confirmAccepting(message: string) {
  return Swal.fire({
    title: "هل انت متأكد ؟",
    text: message,
    icon:'question',
    showCancelButton: true,
    confirmButtonText: 'نعم  اوافق',
    cancelButtonText: 'الغاء',
    confirmButtonColor: "green",
    reverseButtons: true
  });
}


  

  clearAndRoutAfterSDeleting()
  {
    localStorage.removeItem('userToken');
    this.router.navigate(['/login']);
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

}
