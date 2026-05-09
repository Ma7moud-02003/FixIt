import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { ServiceService } from '../../services/-service';
import { finalize, Subscription } from 'rxjs';
import { RouterLink, RouterModule } from "@angular/router";
export interface ServiceRequest {
  clientId: string;
  clientName: string;
  requestDate: string;
  requestedImgUrl: string | null;
  serviceDescription: string;
  serviceId: string;
  serviceTitle: string;
  state: 'priceprocess' | 'completed' | 'pending' | 'cancelled' | 'inprogress';
  submitedImgUrl: string | null;
  totalPrice: number;
  workerId: string;
  workerName: string;
}

export interface ApiResponse {
  currentPage: number;
  data: ServiceRequest[];
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  succeeded: boolean;
}

@Component({
  selector: 'app-services',
  imports: [CommonModule, RouterLink,CommonModule,RouterModule],
  templateUrl: './services.html',
  styleUrl: './services.css',
})
export class Services implements OnInit,OnDestroy{
  private _ser = inject(ServiceService);
 private subs=new Subscription();
  // --- State Signals ---
  servicesResponse = signal<ApiResponse | null>(null);
  isLoading = signal<boolean>(false);
  currentPage = signal<number>(1);
  searchQuery = signal<string>('');
  
  // --- Cache (Map stores pageNumber -> ApiResponse) ---
  private cache = new Map<number, ApiResponse>();

  // --- Computed Signals ---
  filteredServices = computed(() => {
    const data = this.servicesResponse()?.data || [];
    const query = this.searchQuery().toLowerCase();
    if (!query) return data;
    return data.filter(s => 
      s.serviceTitle.toLowerCase().includes(query) || 
      s.clientName.toLowerCase().includes(query)
    );
  });

  ngOnInit(): void {
    this.loadPage(1);
  }

  loadPage(page: number): void {
    // 1. Check Cache
    if (this.cache.has(page)) {
      this.servicesResponse.set(this.cache.get(page)!);
      this.currentPage.set(page);
      return;
    }

    // 2. Fetch from API
    this.isLoading.set(true);
   this.subs.add( this._ser.getAllServices(page).pipe(
      finalize(() => this.isLoading.set(false))
    ).subscribe({
      next: (res) => {
        this.servicesResponse.set(res);
        this.currentPage.set(page);
        this.cache.set(page, res); // Save to cache
      },
      error: (err) => console.error('Error fetching services', err)
    }));
  }

  refresh(): void {
    this.cache.clear();
    this.loadPage(this.currentPage());
  }

  onSearch(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.searchQuery.set(value);
  }

  getStatusStyles(state: string) {
    const themes: Record<string, string> = {
      priceprocess: 'bg-amber-100 text-amber-700 border-amber-200',
      completed: 'bg-emerald-100 text-emerald-700 border-emerald-200',
      pending: 'bg-blue-100 text-blue-700 border-blue-200',
      cancelled: 'bg-rose-100 text-rose-700 border-rose-200',
      inprogress: 'bg-indigo-100 text-indigo-700 border-indigo-200',
    };
    return themes[state] || 'bg-gray-100 text-gray-700';
  }

  getStatusLabel(state: string): string {
    const labels: Record<string, string> = {
      priceprocess: 'تحديد السعر',
      completed: 'مكتملة',
      pending: 'قيد الانتظار',
      cancelled: 'ملغاة',
      inprogress: 'قيد التنفيذ',
    };
    return labels[state] || state;
  }

  
  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}