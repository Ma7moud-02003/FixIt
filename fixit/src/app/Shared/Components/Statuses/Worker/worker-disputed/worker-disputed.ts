import { Component, input } from '@angular/core';
import { ServiceDetailsModel } from '../../../../Models/serviceDetails';

@Component({
  selector: 'app-worker-disputed',
  imports: [],
  templateUrl: './worker-disputed.html',
  styleUrl: './worker-disputed.css',
})
export class WorkerDisputed {
  serviceDetails=input<ServiceDetailsModel>();

}
