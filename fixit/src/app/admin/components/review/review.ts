import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { ReviewService } from '../../services/-review';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Alerts } from '../../../Shared/Alerts/alerts';
export interface Review {
  reviewId: number;
  reviewerName: string;
  reviewerRole: 'client' | 'worker';
  reviewerImgUrl: string | null;
  comment: string;
  rate: number; // assuming 0-100 scale based on example
  createdAt: string;
}

export interface ReviewsResponse {
  currentPage: number;
  data: Review[];
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  pageSize: number;
  succeeded: boolean;
  totalCount: number;
  totalPages: number;
}
@Component({
  selector: 'app-review',
  imports: [CommonModule],
  templateUrl: './review.html',
  styleUrl: './review.css',
})
export class Review implements OnInit,OnDestroy{
 private _rev = inject(ReviewService);

  // --- Signals State ---
  reviewsData = signal<ReviewsResponse | null>(null);
  isLoading = signal<boolean>(false);
  currentPage = signal<number>(1);
  private subs=new Subscription();
  
  // --- Simple Cache Map ---
  private cache = new Map<number, ReviewsResponse>();

  ngOnInit(): void {
    this.loadReviews(1); // تحميل أول صفحة عند البداية
  }

  loadReviews(page: number) {
    // 1. التحديث اللحظي للصفحة الحالية
    this.currentPage.set(page);

    // 2. التحقق من الكاش (Caching Logic)
    if (this.cache.has(page)) {
      this.reviewsData.set(this.cache.get(page)!);
      return;
    }

    // 3. إذا لم تكن موجودة، اطلبها من الـ API
    this.isLoading.set(true);
    
    // مش محتاجين Unsubscribe يدوي لو استخدمنا take(1) أو Signals 
    // بس هنا هنستخدم subscribe عادي ونحولها لـ Signal
    this.subs.add(this._rev.getAllRev(page).subscribe({
      next: (res) => {
        this.cache.set(page, res);
        console.log(res);
         // حفظ في الكاش
        this.reviewsData.set(res);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error fetching reviews:', err);
        this.isLoading.set(false);
      }
    }));
  }

  // Helper Methods للـ UI
  getStars(rate: number):any {
  
  }

  getInitials(name: string): string {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  }
  private alerts=inject(Alerts);
  deleteRev(id:number)
  {
    this.subs.add(
      this._rev.deleteRev(id).subscribe({
        next:(res)=>{
console.log(res);
this.alerts.sucsess('تم حذف التقييم')
        },error:(err)=>{
          console.log(err);
          this.alerts.error('فشل حذف التقييم')
        }
      })
    )
  }
  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
