import { Component, inject, input, OnInit, signal } from '@angular/core';
import { PortfolioModel } from '../../../Models/portfolio';
import { CommonModule } from '@angular/common';
import { Auth } from '../../../../Core/Services/auth';
import { UserRole } from '../../../enums/role';
import { Router, RouterModule } from '@angular/router';



@Component({
  selector: 'app-protfolio-card',
  imports: [CommonModule,RouterModule],
  templateUrl: './protfolio-card.html',
  styleUrl: './protfolio-card.css',
})
export class ProtfolioCard implements OnInit{
  isMe=input<boolean>(false);
  Roles=UserRole;
  portfolio=input<PortfolioModel>();
  private _auth=inject(Auth);
  role=signal<string>('');
 ngOnInit(): void {
   this.role.set(this._auth.getRole()||'')
 }
 rout=inject(Router);
   routForEditing(work:any)
  {
if(this.role()==UserRole.Worker_Role)

    this.rout.navigate(['/dashboared/addPortfolio'],{state:{work}});
  else 
    return;
  }
}
