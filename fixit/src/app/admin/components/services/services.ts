import { CommonModule } from '@angular/common';
import { Component, computed, signal } from '@angular/core';

export type RequestStatus = 'مكتملة' | 'قيد التنفيذ' | 'مقبولة' | 'قيد الانتظار';
 
export interface ServiceRequest {
  id: string;
  client: string;
  clientAvatar: string;
  serviceType: string;
  assignedWorker: string;
  workerAvatar: string;
  date: string;
  cost: number;
  status: RequestStatus;
}
@Component({
  selector: 'app-services',
  imports: [CommonModule],
  templateUrl: './services.html',
  styleUrl: './services.css',
})
export class Services {
  searchQuery   = signal('');
  activeFilter  = signal<RequestStatus | 'الكل'>('الكل');
  currentPage   = signal(1);
  readonly pageSize = 5;
 
  allRequests = signal<ServiceRequest[]>([
    { id: 'REQ-9012', client: 'سارة أحمد',       clientAvatar: 'https://i.pravatar.cc/36?img=47', serviceType: 'إصلاح سباكة',      assignedWorker: 'محمد علي',       workerAvatar: 'https://i.pravatar.cc/36?img=12', date: '2024-05-15', cost: 250,  status: 'قيد الانتظار' },
    { id: 'REQ-8843', client: 'خالد منصور',      clientAvatar: 'https://i.pravatar.cc/36?img=14', serviceType: 'صيانة تكييف',      assignedWorker: 'ياسر حسن',       workerAvatar: 'https://i.pravatar.cc/36?img=11', date: '2024-05-14', cost: 450,  status: 'مقبولة'       },
    { id: 'REQ-8721', client: 'ليلى محمود',      clientAvatar: 'https://i.pravatar.cc/36?img=45', serviceType: 'تنظيف منزلي',      assignedWorker: 'عمر فاروق',      workerAvatar: 'https://i.pravatar.cc/36?img=13', date: '2024-05-14', cost: 180,  status: 'قيد التنفيذ'  },
    { id: 'REQ-8655', client: 'إبراهيم سالم',    clientAvatar: 'https://i.pravatar.cc/36?img=15', serviceType: 'أعمال كهرباء',     assignedWorker: 'سامي عبد الله', workerAvatar: 'https://i.pravatar.cc/36?img=16', date: '2024-05-13', cost: 320,  status: 'مكتملة'       },
    { id: 'REQ-8540', client: 'نورة القحطاني',   clientAvatar: 'https://i.pravatar.cc/36?img=48', serviceType: 'نقل أثاث',         assignedWorker: 'فهد الشهري',     workerAvatar: 'https://i.pravatar.cc/36?img=17', date: '2024-05-12', cost: 1200, status: 'مكتملة'       },
    { id: 'REQ-8410', client: 'رنا الحربي',       clientAvatar: 'https://i.pravatar.cc/36?img=49', serviceType: 'دهانات وديكور',    assignedWorker: 'عبدالله الزهراني', workerAvatar: 'https://i.pravatar.cc/36?img=18', date: '2024-05-11', cost: 750,  status: 'قيد الانتظار' },
    { id: 'REQ-8301', client: 'فيصل العمري',     clientAvatar: 'https://i.pravatar.cc/36?img=20', serviceType: 'تنظيف وتعقيم',    assignedWorker: 'عمر كمال',       workerAvatar: 'https://i.pravatar.cc/36?img=21', date: '2024-05-10', cost: 200,  status: 'مقبولة'       },
    { id: 'REQ-8190', client: 'هند الرشيد',      clientAvatar: 'https://i.pravatar.cc/36?img=44', serviceType: 'تكييف وتبريد',    assignedWorker: 'فهد الرشيدي',   workerAvatar: 'https://i.pravatar.cc/36?img=22', date: '2024-05-09', cost: 390,  status: 'مكتملة'       },
    { id: 'REQ-8050', client: 'طارق الغامدي',    clientAvatar: 'https://i.pravatar.cc/36?img=23', serviceType: 'نجارة وأثاث',     assignedWorker: 'ياسين محمود',   workerAvatar: 'https://i.pravatar.cc/36?img=24', date: '2024-05-08', cost: 550,  status: 'قيد التنفيذ'  },
    { id: 'REQ-7980', client: 'منى السبيعي',     clientAvatar: 'https://i.pravatar.cc/36?img=46', serviceType: 'إصلاح سباكة',     assignedWorker: 'محمد إبراهيم',  workerAvatar: 'https://i.pravatar.cc/36?img=25', date: '2024-05-07', cost: 280,  status: 'مكتملة'       },
  ]);
 
  // ── Derived ────────────────────────────────────────────────
  totalRequests    = computed(() => this.allRequests().length);
  completedCount   = computed(() => this.allRequests().filter(r => r.status === 'مكتملة').length);
  inProgressCount  = computed(() => this.allRequests().filter(r => r.status === 'قيد التنفيذ').length);
  pendingCount     = computed(() => this.allRequests().filter(r => r.status === 'قيد الانتظار').length);
 
  filteredRequests = computed(() => {
    const q   = this.searchQuery().toLowerCase();
    const tab = this.activeFilter();
    return this.allRequests().filter(r => {
      const matchTab = tab === 'الكل' || r.status === tab;
      const matchQ   = !q || r.id.toLowerCase().includes(q) || r.client.includes(q);
      return matchTab && matchQ;
    });
  });
 
  totalPages = computed(() => Math.ceil(this.filteredRequests().length / this.pageSize));
  pages      = computed(() => Array.from({ length: this.totalPages() }, (_, i) => i + 1));
 
  pagedRequests = computed(() => {
    const s = (this.currentPage() - 1) * this.pageSize;
    return this.filteredRequests().slice(s, s + this.pageSize);
  });
 
  displayEnd = computed(() =>
    Math.min(this.currentPage() * this.pageSize, this.filteredRequests().length)
  );
 
  // ── Filters ────────────────────────────────────────────────
  readonly filterTabs: Array<RequestStatus | 'الكل'> = ['مكتملة', 'قيد التنفيذ', 'مقبولة', 'قيد الانتظار', 'الكل'];
 
  // ── Nav items ──────────────────────────────────────────────
  navItems = [
    { label: 'الرئيسية', icon: 'grid' },
    { label: 'المستخدمين', icon: 'users' },
    { label: 'العمال', icon: 'briefcase' },
    { label: 'التصنيفات', icon: 'table' },
    { label: 'طلبات الخدمة', icon: 'clipboard', active: true },
    { label: 'المدفوعات', icon: 'credit-card' },
    { label: 'التقييمات', icon: 'star' },
    { label: 'مراقبة المحادثات', icon: 'message' },
  ];
 
  // ── Actions ────────────────────────────────────────────────
  onSearch(e: Event) {
    this.searchQuery.set((e.target as HTMLInputElement).value);
    this.currentPage.set(1);
  }
 
  setFilter(f: RequestStatus | 'الكل') {
    this.activeFilter.set(f);
    this.currentPage.set(1);
  }
 
  goToPage(p: number) {
    if (p >= 1 && p <= this.totalPages()) this.currentPage.set(p);
  }
 
  // ── Helpers ────────────────────────────────────────────────
  statusCfg(status: RequestStatus) {
    const map: Record<RequestStatus, { bg: string; text: string; dot: string }> = {
      'مكتملة':       { bg: 'bg-slate-100',   text: 'text-slate-600',  dot: 'bg-slate-400'   },
      'قيد التنفيذ':  { bg: 'bg-amber-100',   text: 'text-amber-700',  dot: 'bg-amber-500'   },
      'مقبولة':       { bg: 'bg-sky-100',     text: 'text-sky-700',    dot: 'bg-sky-500'     },
      'قيد الانتظار': { bg: 'bg-violet-100',  text: 'text-violet-700', dot: 'bg-violet-500'  },
    };
    return map[status];
  }
}
