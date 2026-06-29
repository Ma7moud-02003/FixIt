import { Component, computed, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { Subscription } from 'rxjs';
import { ReportsService } from '../../services/reports';
import { CommonModule } from '@angular/common';
export type ReportStatus = 0 | 1 | 2; // 0=Pending, 1=Resolved, 2=Rejected
export interface Report {
  id: string;
reportId: any;          // معرف البلاغ
  title: string;             // عنوان البلاغ (مثل: "عامل كتيان")
  description: string;       // تفاصيل ووصف المشكلة 
  reportType: number;        // نوع البلاغ كـ ID أو كود رقمي
  status: number;            // حالة البلاغ (0: قيد الانتظار، 1: مكتمل، إلخ)
  
  // بيانات المُبلِّغ
  reporterUserId: string;    // الـ ID بتاع المستخدم اللي عمل البلاغ
  reporterUserName: string;  // اسم المستخدم اللي عمل البلاغ
  
  // بيانات المُبلَّغ عنه
  reportedUserId: string;    // الـ ID بتاع المشكو في حقه
  reportedUserName: string;  // اسم الشخص المُبلَّغ عنه (مثل: مصطفى مبروك)
  
  // تواريخ الإجراءات
  createdAt: string;         // تاريخ ووقت تقديم البلاغ (ISO Date String)
  resolvedAt: string | null; // تاريخ الحل (بيكون null لو لسه ما اتقفلش)
  
  // بيانات إضافية من الإدارة والسيستم
  adminNotes: string | null; // ملاحظات الإداره (بتكون null لو مفيش ملاحظات)
  requestId: number | null;
}
 
@Component({
  selector: 'app-reports',
  imports: [CommonModule],
  templateUrl: './reports.html',
  styleUrl: './reports.css',
})
export class Reports implements OnInit,OnDestroy{
 private subs = new Subscription();
  private reportService = inject(ReportsService);
 
  // ── State ──────────────────────────────────────────────────────────────────
  reports = signal<Report[]>([]);
  isLoading = signal(true);
  hasError = signal(false);
 
  // Filter & search
  searchQuery = signal('');
  activeFilter = signal<'all' | ReportStatus>('all');
 
  // Modal state
  selectedReport = signal<Report | null>(null);
  isModalOpen = signal(false);
  isResolveModalOpen = signal(false);
  isSubmitting = signal(false);
  resolveForm = signal({ status: 1 as ReportStatus, adminNotes: '' });
 
  // ── Computed ───────────────────────────────────────────────────────────────
filteredReports = computed(() => {
  let list = this.reports();
  const q = this.searchQuery().trim().toLowerCase();
  const filter = this.activeFilter(); // مثلاً 'all' أو '0' أو '1'

  // 1. الفلترة حسب الحالة (Status)
  if (filter !== 'all') {
    // استخدمنا Number(filter) عشان الـ status في الـ API جاي رقم مش string
    list = list.filter((r) => r.status === Number(filter));
  }

  // 2. الفلترة حسب كلمة البحث (Search Query)
  if (q) {
    list = list.filter((r) => {
      // عملنا حماية بـ ? عشان لو فيه قيمة بـ null أو undefined الكود ما يضربش
      const reporter = r.reporterUserName?.toLowerCase() || '';
      const reported = r.reportedUserName?.toLowerCase() || '';
      const description = r.description?.toLowerCase() || '';
      const title = r.title?.toLowerCase() || '';

      return (
        reporter.includes(q) ||
        reported.includes(q) ||
        description.includes(q) ||
        title.includes(q)
      );
    });
  }

  return list;
});
 
  stats = computed(() => {
    const all = this.reports();
    return {
      total: all.length,
      pending: all.filter((r) => r.status === 0).length,
      resolved: all.filter((r) => r.status === 1).length,
      rejected: all.filter((r) => r.status === 2).length,
    };
  });
 
  // ── Lifecycle ──────────────────────────────────────────────────────────────
  ngOnInit(): void {
    this.getAllReports();
  }
 
  getAllReports() {
    this.isLoading.set(true);
    this.hasError.set(false);
 
    this.subs.add(
      this.reportService.getAllReports().subscribe({
        next: (res: any) => {
          console.log(res);
          
          const data: Report[] = res?.data ?? [];
          this.reports.set(data);
          this.isLoading.set(false);
        },
        error: () => {
          this.hasError.set(true);
          this.isLoading.set(false);
        },
      })
    );
  }
 
  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
 
  // ── Filters ────────────────────────────────────────────────────────────────
  setFilter(filter: 'all' | ReportStatus) {
    this.activeFilter.set(filter);
  }
 
  onSearch(event: Event) {
    this.searchQuery.set((event.target as HTMLInputElement).value);
  }
 
  // ── Detail Modal ───────────────────────────────────────────────────────────
  openDetail(report: Report) {
    this.selectedReport.set(report);
    this.isModalOpen.set(true);
  }
 
  closeModal() {
    this.isModalOpen.set(false);
    this.selectedReport.set(null);
  }
 
  // ── Resolve Modal ──────────────────────────────────────────────────────────
  openResolveModal(report: Report) {
    this.selectedReport.set(report);
    this.resolveForm.set({ status: 1, adminNotes: '' });
    this.isResolveModalOpen.set(true);
  }
 
  closeResolveModal() {
    this.isResolveModalOpen.set(false);
  }
 
  updateResolveStatus(status: ReportStatus) {
    this.resolveForm.update((f) => ({ ...f, status }));
  }
 adminNotes=signal<string>('');
 updateAdminNotes(event: Event) {
  const target = event.target as HTMLTextAreaElement;
  const value = target?.value || '';
  this.adminNotes.set(value);

}
 
  submitResolve() {
    const report = this.selectedReport();
    if (!report) return;
 
    this.isSubmitting.set(true);
 const form={
  status:2,
  adminNotes:this.adminNotes()
 }
console.log(form);

    this.subs.add(
      this.reportService.resolve(report.reportId, form).subscribe({
        next: () => {
        
          this.isSubmitting.set(false);
          this.isResolveModalOpen.set(false);
          this.isModalOpen.set(false);
          this.selectedReport.set(null);
        },
        error: (err) => {
          console.log(err);
          
          this.isSubmitting.set(false);
        },
      })
    );
  }
 
  // ── Helpers ────────────────────────────────────────────────────────────────
  getStatusLabel(status: number): string {
    return { 1: 'قيد الانتظار', 2: 'تم الحل', 0: 'مرفوض' }[status] ?? '—';
  }
 
  getStatusClasses(status: number): string {
    return (
      {
        0: 'bg-amber-100 text-amber-700 border border-amber-200',
        1: 'bg-green-100 text-green-700 border border-green-200',
        2: 'bg-red-100 text-red-700 border border-red-200',
      }[status] ?? ''
    );
  }
 
  formatDate(dateStr: string): string {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }
 
  trackByReport(_: number, r: Report) {
    return r.id;
  }
}