import { Component, computed, DestroyRef, inject, OnDestroy, signal } from '@angular/core';
import { WorkerService } from '../../services/worker-service';
import { debounceTime, distinctUntilChanged, Subject, Subscription } from 'rxjs';
import { WorkerModel } from '../../../Shared/Models/UserProfile';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
 


@Component({
  selector: 'app-workers',
  imports: [CommonModule,FormsModule],
  templateUrl: './workers.html',
  styleUrl: './workers.css',
})
export class Workers implements OnDestroy{
    private workersService = inject(WorkerService);

 
  // ── State signals ────────────────────────────────────────────────────────────
  workers = signal<WorkerModel[]>([]);
  isLoading = signal(true);
  error = signal<string | null>(null);
  currentPage = signal(1);
  pageSize = signal(10);
  totalCount = signal(0);
  searchQuery = '';
  availabilityFilter = signal<boolean | null>(null);
  workerToDelete = signal<Worker | null>(null);
 
  // Search debounce
  private searchSubject = new Subject<string>();
  skeletonRows = [1, 2, 3, 4, 5];
 
  // ── Computed ─────────────────────────────────────────────────────────────────
  totalWorkers = computed(() => this.workers().length + (this.totalCount() - this.workers().length));
  availableWorkers = computed(() => this.workers().filter(w => w.availabilityStatus).length);
  unavailableWorkers = computed(() => this.workers().filter(w => !w.availabilityStatus).length);
  availabilityPercent = computed(() =>
    this.workers().length ? Math.round((this.availableWorkers() / this.workers().length) * 100) : 0
  );
 
  filteredWorkers = computed(() => {
    let result = this.workers();
    const q = this.searchQuery.toLowerCase().trim();
    if (q) result = result.filter(w => w.fullName.toLowerCase().includes(q));
    const f = this.availabilityFilter();
    if (f !== null) result = result.filter(w => w.availabilityStatus === f);
    return result;
  });
 
  totalPages = computed(() => Math.ceil(this.totalCount() / this.pageSize()));
 
  paginationStart = computed(() => (this.currentPage() - 1) * this.pageSize() + 1);
  paginationEnd = computed(() =>
    Math.min(this.currentPage() * this.pageSize(), this.totalCount())
  );
 
  visiblePages = computed<number[]>(() => {
    const total = this.totalPages();
    const cur = this.currentPage();
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
    const pages: number[] = [1];
    if (cur > 3) pages.push(-1);
    for (let i = Math.max(2, cur - 1); i <= Math.min(total - 1, cur + 1); i++) pages.push(i);
    if (cur < total - 2) pages.push(-1);
    pages.push(total);
    return pages;
  });
 
  // ── Lifecycle ────────────────────────────────────────────────────────────────
  ngOnInit() {
    this.fetchWorkers();
 
  
  }
 
  private subs=new Subscription()
    // ── Methods ──────────────────────────────────────────────────────────────────
  fetchWorkers() {
    this.isLoading.set(true);
    this.error.set(null);
 
     this.subs.add(this.workersService
      .getWorkers(this.currentPage(), this.pageSize())
      .subscribe({
        next: (res: any) => {
          // Adapt to your actual API response shape
          const list = res?.data ?? res?.workers ?? res ?? [];
          const count: number = res?.totalCount ?? res?.total ?? list.length;
          this.workers.set(list);
          this.totalCount.set(count);
          this.isLoading.set(false);
        },
        error: (err) => {
          this.error.set(err?.error?.message ?? 'Unable to reach the server. Please try again.');
          this.isLoading.set(false);
        },
      }));
  }
 
  onSearchChange(value: string) {
    this.searchSubject.next(value);
  }
 
  setAvailabilityFilter(value: boolean | null) {
    this.availabilityFilter.set(value);
  }
 
  goToPage(page: number) {
    if (page < 1 || page > this.totalPages()) return;
    this.currentPage.set(page);
    this.fetchWorkers();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
 
  confirmDelete(worker: Worker) {
    this.workerToDelete.set(worker);
  }
 
  cancelDelete() {
    this.workerToDelete.set(null);
  }

 
  getInitials(name: string): string {
    return name
      .split(' ')
      .slice(0, 2)
      .map(n => n[0])
      .join('')
      .toUpperCase();
  }
  
  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
