import { Component, computed, signal } from '@angular/core';
 
export type WorkerStatus  = 'نشط' | 'موقوف' | 'قيد المراجعة';
export type WorkerFilter  = 'الكل' | 'للنشطين' | 'بانتظار المراجعة' | 'الموقوفون';
 
export interface Worker {
  id: number;
  name: string;
  avatar: string;
  specialty: string;
  rating: number;
  reviewCount: number;
  since: string;
  status: WorkerStatus;
  online: boolean;
  idVerified: boolean;
}



@Component({
  selector: 'app-workers',
  imports: [],
  templateUrl: './workers.html',
  styleUrl: './workers.css',
})
export class Workers {
  activeFilter = signal<WorkerFilter>('الكل');
  currentPage  = signal(1);
  readonly pageSize = 6;
 
  allWorkers = signal<Worker[]>([
    { id: 1, name: 'خالد العتيبي',    avatar: 'https://i.pravatar.cc/64?img=12', specialty: 'سباكة وكشف تسربات', rating: 4.8, reviewCount: 124, since: '2023-05-12', status: 'نشط',           online: true,  idVerified: true  },
    { id: 2, name: 'محمد إبراهيم',   avatar: 'https://i.pravatar.cc/64?img=11', specialty: 'كهرباء وتمديدات',   rating: 4.9, reviewCount: 89,  since: '2023-06-20', status: 'نشط',           online: true,  idVerified: true  },
    { id: 3, name: 'ياسين محمود',    avatar: 'https://i.pravatar.cc/64?img=15', specialty: 'نجارة وأثاث',       rating: 4.5, reviewCount: 56,  since: '2024-01-15', status: 'قيد المراجعة', online: false, idVerified: true  },
    { id: 4, name: 'فهد الرشيدي',    avatar: 'https://i.pravatar.cc/64?img=17', specialty: 'تكييف وتبريد',      rating: 4.7, reviewCount: 210, since: '2023-03-05', status: 'نشط',           online: true,  idVerified: true  },
    { id: 5, name: 'عبدالله الزهراني',avatar: 'https://i.pravatar.cc/64?img=18', specialty: 'دهانات وديكور',    rating: 4.2, reviewCount: 34,  since: '2023-11-10', status: 'موقوف',         online: false, idVerified: true  },
    { id: 6, name: 'عمر كمال',       avatar: 'https://i.pravatar.cc/64?img=21', specialty: 'تنظيف وتعقيم',     rating: 4.6, reviewCount: 142, since: '2023-08-22', status: 'نشط',           online: false, idVerified: true  },
    { id: 7, name: 'سامي العنزي',    avatar: 'https://i.pravatar.cc/64?img=22', specialty: 'إصلاح أجهزة',       rating: 4.3, reviewCount: 67,  since: '2023-09-01', status: 'قيد المراجعة', online: false, idVerified: false },
    { id: 8, name: 'بندر الحارثي',   avatar: 'https://i.pravatar.cc/64?img=23', specialty: 'أعمال بناء',        rating: 4.1, reviewCount: 28,  since: '2024-02-10', status: 'نشط',           online: true,  idVerified: true  },
    { id: 9, name: 'تركي السلمي',    avatar: 'https://i.pravatar.cc/64?img=24', specialty: 'سباكة',             rating: 4.0, reviewCount: 19,  since: '2024-03-15', status: 'موقوف',         online: false, idVerified: true  },
  ]);
 
  // ── Stats ──────────────────────────────────────────────────
  totalWorkers   = computed(() => this.allWorkers().length);
  onlineCount    = computed(() => this.allWorkers().filter(w => w.online).length);
  pendingCount   = computed(() => this.allWorkers().filter(w => w.status === 'قيد المراجعة').length);
  suspendedCount = computed(() => this.allWorkers().filter(w => w.status === 'موقوف').length);
 
  // ── Filtered + paged ───────────────────────────────────────
  filteredWorkers = computed(() => {
    const f = this.activeFilter();
    return this.allWorkers().filter(w => {
      if (f === 'الكل')               return true;
      if (f === 'للنشطين')            return w.status === 'نشط';
      if (f === 'بانتظار المراجعة')   return w.status === 'قيد المراجعة';
      if (f === 'الموقوفون')          return w.status === 'موقوف';
      return true;
    });
  });
 
  totalPages = computed(() => Math.ceil(this.filteredWorkers().length / this.pageSize));
  pages      = computed(() => Array.from({ length: this.totalPages() }, (_, i) => i + 1));
 
  pagedWorkers = computed(() => {
    const s = (this.currentPage() - 1) * this.pageSize;
    return this.filteredWorkers().slice(s, s + this.pageSize);
  });
 
  readonly filterTabs: WorkerFilter[] = ['الكل', 'للنشطين', 'بانتظار المراجعة', 'الموقوفون'];
 
  // ── Nav ────────────────────────────────────────────────────

 
  // ── Actions ────────────────────────────────────────────────
  setFilter(f: WorkerFilter) {
    this.activeFilter.set(f);
    this.currentPage.set(1);
  }
 
  goToPage(p: number) {
    if (p >= 1 && p <= this.totalPages()) this.currentPage.set(p);
  }
 
  toggleSuspend(id: number) {
    this.allWorkers.update(ws =>
      ws.map(w => w.id === id
        ? { ...w, status: w.status === 'موقوف' ? 'نشط' : 'موقوف' as WorkerStatus }
        : w
      )
    );
  }
 
  approveWorker(id: number) {
    this.allWorkers.update(ws =>
      ws.map(w => w.id === id && w.status === 'قيد المراجعة'
        ? { ...w, status: 'نشط' as WorkerStatus }
        : w
      )
    );
  }
 
  rejectWorker(id: number) {
    this.allWorkers.update(ws => ws.filter(w => w.id !== id));
  }
 
  // ── Helpers ────────────────────────────────────────────────
  statusCfg(status: WorkerStatus) {
    const map: Record<WorkerStatus, { bg: string; text: string; dot: string }> = {
      'نشط':           { bg: 'bg-emerald-50',  text: 'text-emerald-700', dot: 'bg-emerald-500' },
      'موقوف':         { bg: 'bg-rose-50',     text: 'text-rose-600',    dot: 'bg-rose-500'    },
      'قيد المراجعة':  { bg: 'bg-amber-50',   text: 'text-amber-700',   dot: 'bg-amber-500'   },
    };
    return map[status];
  }
 
  stars(rating: number): boolean[] {
    return Array.from({ length: 5 }, (_, i) => i < Math.round(rating));
  }
}
