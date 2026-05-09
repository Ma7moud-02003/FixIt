import { Component, inject, input, Input, OnInit, signal } from '@angular/core';

import { ServiceStatus } from '../../enums/status';
import { CommonModule } from '@angular/common';
import { MyServiceModel } from '../../Models/services';
import { Router, RouterLink } from "@angular/router";
import { Service } from '../../../Core/Services/service';
import { Auth } from '../../../Core/Services/auth';
import { Alerts } from '../../Alerts/alerts';
@Component({
  selector: 'app-service-card',
  imports: [CommonModule, RouterLink],
  templateUrl: './service-card.html',
  styleUrl: './service-card.css',
})
export class ServiceCard implements OnInit {
 private _auth=inject(Auth);
 role=signal<string>('');
 status=ServiceWorker;

  ngOnInit(): void {
    console.log(this.service());
    this.role.set(this._auth.getRole()||"");

  }
  private _service = inject(Service);
  service = input<MyServiceModel>();
  stasuses = ServiceStatus;
  // Helper to map status to Tailwind color classes
  getStatusClasses() {
    return this._service.getStatusClasses(this.service()?.state || '');
  }

  getStausByArabic(status: string): string {
    return this._service.getStausByArabic(status);
  }
  private rout=inject(Router);
  private alerts=inject(Alerts);
  routeTo(id:string,state:any){
    if(!id||state==ServiceStatus.PRICE_PROCESS||state==ServiceStatus.PENDING){
       this.alerts.sucsess('اطلب خدمه من العميل لكي تتواصل معه');
       return;
    }
this.rout.navigate(['/chat',id])
  }
}