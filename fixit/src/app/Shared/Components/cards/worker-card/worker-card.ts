import { Component, input } from '@angular/core';
import { WorkersModel } from '../../../Models/UserProfile';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-worker-card',
  imports: [RouterLink],
  templateUrl: './worker-card.html',
  styleUrl: './worker-card.css',
})
export class WorkerCard {
  worker = input<WorkersModel>({} as WorkersModel);

}
