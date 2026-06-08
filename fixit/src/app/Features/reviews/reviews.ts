import { Component, computed, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { Review } from '../../Core/Services/review';
import { Subscription } from 'rxjs';
import { ReviewModel } from '../../Shared/Models/review';
import { ActivatedRoute } from '@angular/router';
import { Auth } from '../../Core/Services/auth';
import { UserRole } from '../../Shared/enums/role';
import { ReviewCard } from "../../Shared/Components/cards/review-card/review-card";
import { CommonModule } from '@angular/common';

interface WorkerData {
  imgUrl: string,
  workerName: string
}

@Component({
  selector: 'app-reviews',
  imports: [ReviewCard,CommonModule],
  templateUrl: './reviews.html',
  styleUrl: './reviews.css',
})
export class Reviews implements OnInit, OnDestroy {

  Roles = UserRole;

  private _review = inject(Review);
  private router = inject(ActivatedRoute);
  private auth = inject(Auth);

  private subs = new Subscription();

  // ===================== STATE =====================
  workerReviews = signal<ReviewModel[]>([]);
  workerData = signal<WorkerData>({} as WorkerData);

  workerId = signal<string>('');
  role = signal<string>('');

  filterBy = signal<string>('');

  // pagination state
  page = signal<number>(1);
  pageSize = signal<number>(10);
  totalItems = signal<number>(0);

  // ===================== CACHE =====================
  private cache = new Map<string, ReviewModel[]>();

  // ===================== INIT =====================
  ngOnInit(): void {
  
    this.myId.set(this.auth.getUserId());
    this.role.set(this.auth.getRole() || '');

    this.router.paramMap.subscribe({
      next: (res) => {
        const id = res.get('workerId') || '';
        this.workerId.set(id);

        if (id) {
          this.loadWorkerReviewsForClient();
        } else if ((this.role() === UserRole.Worker_Role&&this.myId()==this.workerId())||(this.role()===UserRole.Worker_Role&&!this.workerId())) {
          this.loadWorkerReviews();
        }
      }
    });
  }

  myId=signal<string>('');

  // ===================== WORKER REVIEWS =====================
  loadWorkerReviews() {
    const key = `worker-${this.page()}-${this.pageSize()}`;

    // ✅ CACHE CHECK
    if (this.cache.has(key)) {
      this.workerReviews.set(this.cache.get(key)!);
      return;
    }

    this.subs.add(
      this._review.getAllRevies(this.page(), this.pageSize()).subscribe({
        next: (res: any) => {
          const data = res.data || [];
this.totalPages.set(res.totalPages)
          this.workerReviews.set(data);
          console.log(res);
          
          // cache
          this.cache.set(key, data);

          // optional total
          this.totalItems.set(res.totalItems || 0);
        }
      })
    );
  }

totalPages=signal<number>(0)
   getPagesArray(): number[] {
  const total = this.totalPages(); // أو حسب إذا كانت سجنال أو متغير عادي
  return Array.from({ length: total }, (_, i) => i + 1);
}

  // ===================== CLIENT REVIEWS =====================
  loadWorkerReviewsForClient() {
    const id = this.workerId();
    const key = `client-${id}`;

    // ✅ CACHE CHECK
    if (this.cache.has(key)) {
      const cached = this.cache.get(key)!;
      this.workerReviews.set(cached);
      return;
    }

    this.subs.add(
      this._review.getAllReviewsForUser(id).subscribe({
        next: (res: any) => {
          const data = res.data || [];
console.log(res);

          const workerData: WorkerData = {
            imgUrl: data?.imgUrl,
            workerName: data?.workerName
          };

          this.workerReviews.set(data);
          this.workerData.set(workerData);

          this.cache.set(key, data);
        }
      })
    );
  }

  // ===================== FILTER =====================
  filteredReview = computed(() => {
    const reviews = this.workerReviews();
    const filter = this.filterBy();

    let result = [...reviews];

    if (filter === 'rate') {
      result.sort((a, b) => b.rate - a.rate);
    }

    if (filter === 'newest') {
      result.sort((a, b) =>
        new Date(b.createdAt).getTime() -
        new Date(a.createdAt).getTime()
      );
    }

    return result;
  });

  getFilter(filter: string) {
    this.filterBy.set(filter);
  }

  // ===================== PAGINATION =====================
  changePage(page: number) {
    this.page.set(page);
    this.loadWorkerReviews();
  }
  nextPage() {

    this.page.set(this.page() + 1);
    this.loadWorkerReviews();
  
}

prevPage() {
  if (this.page() > 1) {
    this.page.set(this.page() - 1);
    this.loadWorkerReviews();
  }
}

goToPage(page: number) {
  if (page !== this.page()) {
    this.page.set(page);
    this.loadWorkerReviews();
  }}

  // ===================== CLEAN =====================
  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}