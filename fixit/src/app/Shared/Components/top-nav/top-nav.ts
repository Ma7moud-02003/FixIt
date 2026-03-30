import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from "@angular/router";
import { Auth } from '../../../Core/Services/auth';

@Component({
  selector: 'app-top-nav',
  imports: [RouterLink],
  templateUrl: './top-nav.html',
  styleUrl: './top-nav.css',
})
export class TopNav implements OnInit{
 _auth=inject(Auth);
 role=signal<string>('');
ngOnInit(): void {
  this.role.set(this._auth.getRole()||'');

}

  logOut()
  {
this._auth.logout();
  }
}
