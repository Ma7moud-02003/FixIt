import { Component, inject, OnInit, signal } from '@angular/core';
import { Router, RouterLink, RouterModule } from "@angular/router";
import { Auth } from '../../../Core/Services/auth';
import { UserRole } from '../../enums/role';
import { CommonModule } from '@angular/common';
interface User{
  fullName:string,
  imgUrl:string,
  role:string
}
@Component({
  selector: 'app-top-nav',
  imports: [RouterLink,RouterModule,CommonModule],
  templateUrl: './top-nav.html',
  styleUrl: './top-nav.css',
})
export class TopNav implements OnInit{
 _auth=inject(Auth);
 role=signal<string>('');
 Role=UserRole
 router=inject(Router);

ngOnInit(): void {

  this.user.set(this._auth.getNavDetails() as User)
  console.log(this.user());
  
  this.role.set(this._auth.getRole()||'');
}

routeTo(route:string){
this.router.navigate([`/mainLayout/${route}`])
}

isLinkActive(path: string): boolean {
  return this.router.url === path;
}
showDropDowen=signal<boolean>(false);
user=signal<User>({} as User)

  logOut()
  {
this._auth.logout();
  }
}
