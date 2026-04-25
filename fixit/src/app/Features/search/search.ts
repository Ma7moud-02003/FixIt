import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { finalize, Subscription } from 'rxjs';
import { User } from '../../Core/Services/user';
import { WorkerCard } from "../../Shared/Components/cards/worker-card/worker-card";
import { categories } from '../../Shared/Models/categorys';
import { goverments } from '../../Shared/Models/goverments';
import { WorkersModel } from '../../Shared/Models/UserProfile';

interface Catog {
  name: string;
  selected: boolean;
}

interface City {
  name: string;
  selected: boolean;
}

@Component({
  selector: 'app-search',
  imports: [CommonModule, FormsModule, WorkerCard],
  templateUrl: './search.html',
  styleUrl: './search.css',
})
export class Search implements OnInit, OnDestroy {

  ngOnInit(): void {
    this.getAllWorkers();
  }
  
  egyptGovernorates=signal<any[]>(goverments);
  categories=signal<any[]>(categories);
  // ================= Signals =================
  filterCategory = signal<string | null>(null);
  rate = signal<number>(0);
  isAvailable = signal<boolean>(false);
  filterCity = signal<string | null>(null);
  searchWord = signal<string>('');

  allWorkers = signal<WorkersModel[]>([]);
  showLoading = signal<boolean>(true);

  // ================= Pagination =================
  page = signal<number>(1);
  pageSize = signal<number>(8);

  // ================= UI =================
  isCityOpen = true;
  isCategoryOpen = true;
  isMobileSidebarOpen = false;
  showAllCities = false;

  // ================= Services =================
  private subs = new Subscription();
  private user = inject(User);

  // ================= Cache =================
  private workersCache = new Map<string, WorkersModel[]>();

  // ================= Computed =================
  filterdWorkers = computed(() => {
    let workers = this.allWorkers();

    if (this.filterCategory()) {
      workers = workers.filter(w => w.categoryName === this.filterCategory());
    }

    if (this.rate() > 0) {
      workers = workers.filter(w => w.rate >= this.rate());
    }

    return workers;
  });

  // ================= API =================
getAllWorkers() {

  const page = this.page();
  const size = this.pageSize();

  // 👇 cache على الصفحات فقط
  const key = `${page}-${size}`;

  // ===== Check Cache =====
  if (this.workersCache.has(key)&&!this.searchWord()) {
    console.log('cashed');
    
    this.allWorkers.set(this.workersCache.get(key)!);
    this.showLoading.set(false);
    return;
  }

  this.showLoading.set(true);

  const search = this.searchWord();
  const city = this.filterCity();
  const isAvailable = this.isAvailable();

  this.subs.add(
    this.user.getWorkers(
      page,
      size,
      search,
      city || undefined,
      isAvailable
    )
    .pipe(finalize(() => this.showLoading.set(false)))
    .subscribe({
      next: (res: any) => {
console.log(res);
        // 👇 نخزن حسب الصفحة فقط
        this.workersCache.set(key, res.data);

        this.allWorkers.set(res.data);
      }
    })
  );
}
  // ================= Search =================
  private searchTimeout: any;

  onSearchChange(value: string) {
    this.searchWord.set(value);
    clearTimeout(this.searchTimeout);
    this.searchTimeout = setTimeout(() => {
      this.page.set(1);
      this.getAllWorkers();
    }, 200);
    
  }

  // ================= Filters =================
  setCatog(name: string) {
    this.filterCategory.set(
      this.filterCategory() === name ? null : name
    );

    this.page.set(1);
    this.workersCache.clear();
    this.getAllWorkers();
  }

  setRate(value: number) {
    this.rate.set(this.rate() === value ? 0 : value);
  }

  setCity(name: string) {
    this.filterCity.set(
      this.filterCity() === name ? null : name
    );

    this.page.set(1);
    this.workersCache.clear();
    this.getAllWorkers();
  }

  getAvailable() {
    this.isAvailable.update(v => !v);
    this.page.set(1);
    this.workersCache.clear();
    this.getAllWorkers();
  }

  // ================= Pagination =================
  getPage(pageNum: number) {
    this.page.set(pageNum);
    this.getAllWorkers();
  }

  getNextOrPreviousPage(next: boolean) {
    this.page.update(p => next ? p + 1 : p - 1);
    this.getAllWorkers();
  }

  // ================= UI =================
  toggleMobileSidebar() {
    this.isMobileSidebarOpen = !this.isMobileSidebarOpen;
  }

  toggleCityView() {
    this.showAllCities = !this.showAllCities;
  }

  toggleCity() {
    this.isCityOpen = !this.isCityOpen;
  }

  toggleCategory() {
    this.isCategoryOpen = !this.isCategoryOpen;
  }

  resetFilters() {
    this.filterCategory.set(null);
    this.filterCity.set(null);
    this.searchWord.set('');
    this.rate.set(0);
    this.isAvailable.set(false);
    this.page.set(1);

    this.workersCache.clear();
    this.getAllWorkers();
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}