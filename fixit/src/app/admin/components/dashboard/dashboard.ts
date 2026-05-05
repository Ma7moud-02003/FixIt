import { Component, signal } from '@angular/core';

import { CommonModule } from '@angular/common';
 
export interface RecentOp {
  user: string;
  service: string;
  time: string;
  price: number;
  status: 'مكتمل' | 'قيد الانتظار' | 'مرفوض';
}
 

@Component({
  selector: 'app-dashboard',
  imports: [],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  totalUsers   = signal(12450);
  totalWorkers = signal(1840);
  activeOrders = signal(342);
  totalRevenue = signal(84200);
 
  recentOps = signal<RecentOp[]>([
    { user: 'سارة أحمد',    service: 'إصلاح تكييف',  time: 'منذ 5 دقائق',  price: 250, status: 'مكتمل'        },
    { user: 'محمد خالد',   service: 'تركيب إضاءة',  time: 'منذ 12 دقيقة', price: 120, status: 'قيد الانتظار' },
    { user: 'عبدالله علي', service: 'تسليك مجاري',  time: 'منذ 30 دقيقة', price: 400, status: 'مرفوض'        },
    { user: 'ليلى مراد',   service: 'تنظيف عميق',   time: 'منذ ساعة',     price: 350, status: 'مكتمل'        },
  ]);
 
  weekDays  = ['السبت','الأحد','الاثنين','الثلاثاء','الأربعاء','الخميس','الجمعة'];
  totalBars = [44, 38, 46, 42, 43, 62, 40];
  doneBars  = [32, 28, 38, 30, 53, 57, 28];
  readonly maxBar = 70;
 
  donutSegments = [
    { label: 'الصيانة المنزلية', color: '#ef4444', pct: 35 },
    { label: 'السباكة',           color: '#1e3a5f', pct: 25 },
    { label: 'الكهرباء',          color: '#10b981', pct: 22 },
    { label: 'النظافة',           color: '#f59e0b', pct: 18 },
  ];
 
  navItems = [
    { label: 'الرئيسية',         icon: 'grid',       active: true },
    { label: 'المستخدمين',       icon: 'users'       },
    { label: 'العمال',            icon: 'briefcase'   },
    { label: 'التصنيفات',         icon: 'table'       },
    { label: 'طلبات الخدمة',     icon: 'clipboard'   },
    { label: 'المدفوعات',         icon: 'credit-card' },
    { label: 'التقييمات',         icon: 'star'        },
    { label: 'مراقبة المحادثات', icon: 'message'     },
  ];
 
  barH(v: number) { return Math.round((v / this.maxBar) * 100); }
 
  statusCls(s: RecentOp['status']) {
    const m: Record<RecentOp['status'], string> = {
      'مكتمل':        'bg-emerald-100 text-emerald-700',
      'قيد الانتظار': 'bg-amber-100 text-amber-700',
      'مرفوض':        'bg-rose-100 text-rose-600',
    };
    return m[s];
  }
 
  donutStyle(index: number): string {
    const r = 50, circ = 2 * Math.PI * r;
    const off  = this.donutSegments.slice(0, index).reduce((a, s) => a + s.pct, 0);
    const dash = (this.donutSegments[index].pct / 100) * circ;
    return `stroke-dasharray:${dash} ${circ - dash};stroke-dashoffset:${-((off / 100) * circ) + circ / 4}`;
  }
}
