import { Component, input } from '@angular/core';
import { WorkersModel } from '../../../Models/UserProfile';
import { RouterLink } from "@angular/router";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-worker-card',
  imports: [RouterLink,CommonModule],
  templateUrl: './worker-card.html',
  styleUrl: './worker-card.css',
})
export class WorkerCard {
  worker = input<WorkersModel>({} as WorkersModel);

}
