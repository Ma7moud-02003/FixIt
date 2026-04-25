import { Component, inject, input, Input, OnInit, signal } from '@angular/core';

import { ServiceStatus } from '../../enums/status';
import { CommonModule } from '@angular/common';
import { MyServiceModel } from '../../Models/services';
import { RouterLink } from "@angular/router";
import { Service } from '../../../Core/Services/service';
import { Auth } from '../../../Core/Services/auth';

@Component({
  selector: 'app-service-card',
  imports: [CommonModule, RouterLink],
  templateUrl: './service-card.html',
  styleUrl: './service-card.css',
})
export class ServiceCard implements OnInit {
 private _auth=inject(Auth);
 role=signal<string>('');

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
}