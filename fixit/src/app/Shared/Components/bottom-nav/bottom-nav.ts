import { roleGuard } from './../../../Core/Guards/role-guard';
import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from "@angular/router";
import { Auth } from '../../../Core/Services/auth';
import { UserRole } from '../../enums/role';

@Component({
  selector: 'app-bottom-nav',
  imports: [RouterLink],
  templateUrl: './bottom-nav.html',
  styleUrl: './bottom-nav.css',
})
export class BottomNav implements OnInit{
  Role=UserRole;
  private _auth=inject(Auth);
  role=signal<string>('');
  ngOnInit(): void {
   this.role.set(this._auth.getRole()||'') 
  }
}
