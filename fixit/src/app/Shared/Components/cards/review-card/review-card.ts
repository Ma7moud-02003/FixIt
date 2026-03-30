import { Component, input } from '@angular/core';
import { ReviewModel } from '../../../Models/review';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-review-card',
  imports: [CommonModule],
  templateUrl: './review-card.html',
  styleUrl: './review-card.css',
})
export class ReviewCard {
  review=input<any>();
  
}
