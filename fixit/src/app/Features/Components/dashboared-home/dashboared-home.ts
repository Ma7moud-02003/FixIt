import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { DetailsSer } from '../../../Core/Services/details-ser';
import { forkJoin, Subscription } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { FormDatePipe } from '../../../Shared/Pipes/form-date-pipe';
import { RouterModule } from '@angular/router';

interface ServiceItem {
  clientImgUrl: string;
  clientName: string;
  workerImgUrl: string;
  workerName: string;
  serviceTitle: string;
  totalPrice: number;
  state: number;
}
 
interface MessageItem {
  senderImgUrl: string;
  senderName: string;
  targetUserImgUrl: string;
  targetUserName: string;
  lastMessage: string;
  lastMessageAt: string;
}
 
interface ReviewItem {
  reviewerImgUrl: string;
  reviewerName: string;
  comment: string;
  rate: number;
}
 
interface TotalsData {
  totalNumberOfPortfolioes: number;
  totalNumberOfReportes: number;
  totalNumberOfReviews: number;
  totalNumberOfServicesRequests: number;
}
@Component({
  selector: 'app-dashboared-home',
  imports: [CommonModule,FormsModule,FormDatePipe,RouterModule],
  templateUrl: './dashboared-home.html',
  styleUrl: './dashboared-home.css',
})
export class DashboaredHome implements OnInit ,OnDestroy{
  private details = inject(DetailsSer);
  private subscription = new Subscription();
 
  services: ServiceItem[] = [];
  messages: MessageItem[] = [];
  reviews: ReviewItem[] = [];
  totals: TotalsData | null = null;
 
  isLoading = signal<boolean>(false);
  hasError = false;

  ngOnInit(): void {
    this.loadData();
  }
 
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
 
  loadData(): void {
    this.isLoading.set(true);
    this.hasError = false;
 
    const sub = forkJoin({
      services: this.details.getWorkerDetails('Services'),
      messages: this.details.getWorkerDetails('Messasges'),
      reviews: this.details.getWorkerDetails('Reviews'),
      totals: this.details.getNumbers('TotalNumbersDetailsForWorker'),
    }).subscribe({
      next: (result:any) => {
        console.log(result);
        
        this.services = result.services.data as ServiceItem[];
        this.messages = result.messages.data as MessageItem[];
        this.reviews = result.reviews.data as ReviewItem[];
        this.totals = result.totals.data as TotalsData;
        this.isLoading.set(false);
      },
      error: () => {
        this.hasError = true;
             this.isLoading.set(false);

      },
    });
 
    this.subscription.add(sub);
  }
 
 
 
  getStarsArray(rate: number): boolean[] {
    return Array.from({ length: 5 }, (_, i) => i < Math.round(rate));
  }
 
  trackByIndex(index: number): number {
    return index;
  }
}
