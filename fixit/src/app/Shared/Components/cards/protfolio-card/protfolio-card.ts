import { Component, input } from '@angular/core';
import { PortfolioModel } from '../../../Models/portfolio';
import { CommonModule } from '@angular/common';



@Component({
  selector: 'app-protfolio-card',
  imports: [CommonModule],
  templateUrl: './protfolio-card.html',
  styleUrl: './protfolio-card.css',
})
export class ProtfolioCard {
  portfolio=input<PortfolioModel>();

}
