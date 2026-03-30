import { Component, inject, input, Input } from '@angular/core';
import { SendedServiceRequestModel } from '../../Models/sendedSrciveModel';
import { ServiceStatus } from '../../enums/status';
import { CommonModule } from '@angular/common';
import { RecivedServiceRequestModel } from '../../Models/RecivedServiceModel';
import { RouterLink } from "@angular/router";
import { Service } from '../../../Core/Services/service';

@Component({
  selector: 'app-recived-service-card',
  imports: [CommonModule, RouterLink],
  templateUrl: './service-card.html',
  styleUrl: './service-card.css',
})
export class RecivedServiceCard {
  service = input<RecivedServiceRequestModel>();
  private _service=inject(Service);
  // Helper to map status to Tailwind color classes
  getStatusClasses() {
  return this._service.getStatusClasses(this.service()?.state||'');

  }

  getStausByArabic(status: string): string {
    return this._service.getStausByArabic(status);
}
}