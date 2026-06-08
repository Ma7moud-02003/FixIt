import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { finalize, Subscription } from 'rxjs';
import { User } from '../../Core/Services/user';
import { WorkerCard } from "../../Shared/Components/cards/worker-card/worker-card";
import { goverments } from '../../Shared/Models/goverments';
import { WorkersModel } from '../../Shared/Models/UserProfile';
import { CateModdel } from '../../Shared/Models/categorys';

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
 // ================= Services =================
  private subs = new Subscription();
  private user = inject(User);

  // ================= Signals & State =================
  totalPages = signal<number>(0);
  page = signal<number>(1);
  pageSize = signal<number>(8);
  
  allWorkers = signal<WorkersModel[]>([]);
  showLoading = signal<boolean>(true);

  // البيانات الأساسية
  egyptGovernorates = signal<any[]>(goverments);
  categories = signal<CateModdel[]>([]);

  // فلاتر البحث والتصفية
  filterCategory = signal<string | null>(null);
  rate = signal<number>(0);
  isAvailable = signal<boolean>(false);
  filterCity = signal<string | null>(null);
  searchWord = signal<string>('');        // حقل بحث الاسم (العلوي)
  citySearchQuery = signal<string>('');   // حقل بحث المحافظات (الداخلي)

  // ================= UI Utilities =================
  isCityOpen = true;
  isCategoryOpen = false;
  isMobileSidebarOpen = false;
  showAllCities = false;
  protected readonly Array = Array;
  private searchTimeout: any;

  // ================= Cache System =================
  private workersCache = new Map<string, any>();

  // ================= Computed Properties =================
  // تصفية أوتوماتيكية سريعة للمحافظات بناءً على المدخل الداخلي
  filteredCities = computed(() => {
    const query = this.citySearchQuery().trim().toLowerCase();
    if (!query) return this.egyptGovernorates();
    return this.egyptGovernorates().filter(city => 
      city.name.toLowerCase().includes(query)
    );
  });

  // الفلاتر الفرعية (التي تتم Front-end لتخفيف الضغط على الـ API)
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

  // ================= Lifecycle Hooks =================
  ngOnInit(): void {
    this.getAllWorkers();
    this.getCategorise();
  }

getCategorise(){
  this.subs.add(
    this.user.getCategorise().subscribe({
      next:(res:any)=>{
console.log(res);
 this.categories.set(res.data)
      }
    })
  )
}

  // ================= Core API Function (الموحدة والذكية) =================
  getAllWorkers() {
    const page = this.page();
    const size = this.pageSize();
    const search = this.searchWord().trim();
    const city = this.filterCity();
    const isAvail = this.isAvailable();

    // 🔑 مفتاح الكاش الافتراضي للصفحات العادية
    const cacheKey = `${page}-${size}`;

    // 🚨 مؤشر الفلاتر النشطة: لو المستخدم بيبحث بالاسم، أو المحافظة، أو المتاح الآن
    const hasActiveFilters = !!search || !!city || isAvail;

    // 1️⃣ لو البيانات متكشفة ومفيش أي فلاتر نشطة -> اسحب من الكاش فوراً ووفر الـ Request
    if (!hasActiveFilters && this.workersCache.has(cacheKey)) {
      console.log('⚡ Loaded from Cache');
      const cached = this.workersCache.get(cacheKey);
      this.allWorkers.set(cached.data);
      this.totalPages.set(cached.totalPages);
      this.showLoading.set(false);
      return;
    }

    this.showLoading.set(true);

    // 2️⃣ ضرب الـ API (لاحظ ترتيب البارامترات: المحافظة تذهب لـ address والبحث يذهب لـ search)
   // داخل دالة getAllWorkers()
const selectedCategories = this.catogs();

this.subs.add(
  this.user.getWorkers(
    page,
    size,
    city || undefined,
    search || undefined,
    isAvail,
    this.rate() || undefined, // إرسال التقييم للسيرفر أيضاً لو متاح
    selectedCategories.length > 0 ? selectedCategories.join(',') : undefined // تحويل المصفوفة لـ string مفصول بفاصلة (مثال: 1,2,5) إذا كان الـ Backend يتوقعها كـ Query Parameter أو اتركها كمصفوفة حسب حاجة الـ API
  )
  .pipe(finalize(() => this.showLoading.set(false)))
  .subscribe({
    next: (res: any) => {
      this.allWorkers.set(res.data || []);
      this.totalPages.set(res.totalPages || 0);
    }
  })
);
  }

  // ================= Event Handlers =================
  
  // التحكم في حقل البحث العلوي (Debounce لمنع تكرار الطلبات مع كل حرف)
  onSearchChange(value: string) {
    this.searchWord.set(value);
    clearTimeout(this.searchTimeout);
    this.searchTimeout = setTimeout(() => {
      this.page.set(1);
      this.getAllWorkers(); // استدعاء الدالة الموحدة
    }, 350);
  }
private cityTimeout: any;

onCityChange(value: string) {
  this.filterCity.set(value);
  
  clearTimeout(this.cityTimeout);
  this.cityTimeout = setTimeout(() => {
    this.page.set(1);
    this.getAllWorkers(); // استدعاء السيرفر مباشرة وتخطي الكاش
  }, 400); // انتظر 400ms بعد توقف المستخدم عن الكتابة ثم ارسل الريكوست
}
// 1. تغيير السجنال لتستقبل مصفوفة من الـ IDs (أرقام أو نصوص حسب الـ Backend عندك)
catogs = signal<number[]>([]); 

// ================= Filters =================

setCatog(id: number) {
  this.catogs.update(currentIds => {
    // لو الـ ID موجود مسبقاً احذفه (شيل علامة الصح)، لو مش موجود ضيفه
    if (currentIds.includes(id)) {
      return currentIds.filter(item => item !== id);
    } else {
      console.log([...currentIds,id]);
      
      return [...currentIds, id];
    }
  });

  // إعادة الصفحة للأولى عند تغيير الفلاتر
  this.page.set(1);
  
  // استدعاء دالة الجلب
  this.getAllWorkers();
}

  // فلتر متاح الآن
  getAvailable() {
    this.isAvailable.update(v => !v);
    this.page.set(1);
    this.getAllWorkers();
  }

  setRate(value: number) {
    this.rate.set(this.rate() === value ? 0 : value);
    this.getAllWorkers();
  }

  // ================= Pagination Actions =================
  getPage(pageNum: number) {
    this.page.set(pageNum);
    this.getAllWorkers();
  }

  getNextOrPreviousPage(next: boolean) {
    this.page.update(p => next ? p + 1 : p - 1);
    this.getAllWorkers();
  }

  // ================= UI Toggles =================
  toggleMobileSidebar() { this.isMobileSidebarOpen = !this.isMobileSidebarOpen; }
  toggleCityView() { this.showAllCities = !this.showAllCities; }
  toggleCity() { this.isCityOpen = !this.isCityOpen; }
  toggleCategory() { this.isCategoryOpen = !this.isCategoryOpen; }

  resetFilters() {
    this.filterCategory.set(null);
    this.filterCity.set(null);
    this.searchWord.set('');
    this.citySearchQuery.set('');
    this.rate.set(0);
    this.isAvailable.set(false);
    this.page.set(1);
    this.workersCache.clear();
    this.getAllWorkers();
  }

  getPagesArray(): number[] {
  const total = this.totalPages(); // أو حسب إذا كانت سجنال أو متغير عادي
  return Array.from({ length: total }, (_, i) => i + 1);
}

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}