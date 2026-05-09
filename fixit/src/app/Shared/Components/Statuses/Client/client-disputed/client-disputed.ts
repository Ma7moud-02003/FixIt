import { Component, input } from '@angular/core';
import { ServiceDetailsModel } from '../../../../Models/serviceDetails';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-client-disputed',
  imports: [CommonModule],
  templateUrl: './client-disputed.html',
  styleUrl: './client-disputed.css',
})
export class ClientDisputed {
  serviceDetails=input<ServiceDetailsModel>();
}
