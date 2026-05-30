import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from "@angular/router";
import { Auth } from '../../../Core/Services/auth';
import { UserRole } from '../../enums/role';
interface User{
  fullName:string,
  imgUrl:string,
  role:string
}
@Component({
  selector: 'app-top-nav',
  imports: [RouterLink],
  templateUrl: './top-nav.html',
  styleUrl: './top-nav.css',
})
export class TopNav implements OnInit{
 _auth=inject(Auth);
 role=signal<string>('');
 Role=UserRole


ngOnInit(): void {

  this.user.set(this._auth.getNavDetails() as User)
  console.log(this.user());
  
  this.role.set(this._auth.getRole()||'');
}

user=signal<User>({} as User)

  logOut()
  {
this._auth.logout();
  }
}
