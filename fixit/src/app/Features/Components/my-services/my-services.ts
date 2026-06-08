import { Component, computed, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { ServiceCard } from "../../../Shared/Components/my-service-card/service-card";
import { Service } from '../../../Core/Services/service';
import { finalize, Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Skeleton } from "../../../Shared/Components/skeleton/skeleton";
import { Auth } from '../../../Core/Services/auth';
import { UserRole } from '../../../Shared/enums/role';
import { MyServiceModel } from '../../../Shared/Models/services';
import { ServiceStatus } from '../../../Shared/enums/status';

@Component({
  selector: 'app-my-sended-services',
  imports: [CommonModule, ServiceCard, Skeleton],
  templateUrl: './my-sended-services.html',
  styleUrl: './my-sended-services.css',
})
export class MyServices implements OnInit, OnDestroy {

  private _services = inject(Service);

  subs = new Subscription();

  // 🔥 signals
  catogery = signal<string>('');
  pageNume = signal<number>(1);
  showLoading = signal<boolean>(false);

  // 🧠 الكاش
cache = new Map<string, { data: any[], totalPages: number }>();
  private _auth = inject(Auth);
  role = signal<string>('');
  Role = UserRole;
  // 📦 البيانات الحالية
  myServices = signal<MyServiceModel[]>([]);

 

  ngOnInit(): void {
    this.role.set(this._auth.getRole() || '');
    console.log(this.role());
    
    this.loadPage(this.pageNume());
  }

   statuses = signal<any[]>([
    { name: 'الكل', value: '' },
    { name:'مرسله|مستلمه', value: 'priceprocess' },
    { name: 'معلقه', value: 'pending' },
    { name: 'مرفوضه | ملغاه', value: 'rejected' },
    { name: 'قيد التنفيذ', value: 'inprocess' },
    { name: 'تم التسليم', value: 'submitted' },
    { name: 'مكتمله', value: 'completed' },
    { name: 'جار حل النزاع', value: 'disputed' },
    { name: 'تم التقييم', value: 'reviewed' }
  ]);

  workerServicesType=signal<string>('requested');
    
totalPages=signal<number>(0);

// دالة بتحول الرقم لمصفوفة أرقام متتالية
getPagesArray(): number[] {
  const total = this.totalPages(); // أو حسب إذا كانت سجنال أو متغير عادي
  return Array.from({ length: total }, (_, i) => i + 1);
}

  // 🎯 فلترة
  filterdServices = computed(() => {
    const category = this.catogery();
    const data = this.myServices();
    if (!category) return data;
    return data.filter(item => item.state === category);
  });

  inprogressNum=computed(()=>{
    return this.myServices().filter((m)=>{
      return m.state==ServiceStatus.InProcess;
    })
  })

  // 🚀 تحميل الصفحة (مع كاش ذكي ومركب)
loadPage(page: number) {
  // 🔑 عمل مفتاح فريد للكاش يجمع (الدور + النوع + الصفحة) لمنع تداخل البيانات
  const cacheKey = `${this.role()}_${this.workerServicesType()}_page_${page}`;

  // ✅ لو موجود في الكاش.. اعرضه فوراً ووفر الـ API
  if (this.cache.has(cacheKey)) {
    const cachedData = this.cache.get(cacheKey)!;
    this.myServices.set(cachedData.data);
    this.totalPages.set(cachedData.totalPages);
    return;
  }

  // 🔄 لو مش موجود → اضرب API
  this.showLoading.set(true);

  // تحديد الـ Observable المناسب بناءً على الشروط لتقليل تكرار الكود (DRY)
  let serviceObservable$;

  if (this.role() === this.Role.Clien_Role) { // 💡 تم تصحيح الـ Typo هنا أيضاً Client_Role
    serviceObservable$ = this._services.getSendedServices(page, 10);
  } else if (this.role() === UserRole.Worker_Role) {
    if (this.workerServicesType() === 'requested') {
      serviceObservable$ = this._services.getResivedServices(page, 10);
    } else {
      serviceObservable$ = this._services.getSendedServices(page, 10);
    }
  }

  // تنفيذ الطلب والاشتراك فيه بشكل موحد ونظيف
  if (serviceObservable$) {
    this.subs.add(
      serviceObservable$.pipe(
        finalize(() => this.showLoading.set(false))
      ).subscribe({
        next: (res) => {
          // 💾 خزّن البيانات والـ totalPages معاً في الكاش تحت المفتاح المركب
          this.cache.set(cacheKey, { data: res.data, totalPages: res.totalPages });
          
          this.myServices.set(res.data);
          this.totalPages.set(res.totalPages);
        },
        error: (err) => console.error('Fixit Error:', err)
      })
    );
  }
}

switchServiceType(type: string) {
  this.workerServicesType.set(type);
  this.loadPage(1); // العودة للصفحة الأولى دائماً عند تغيير التبويب
}


  // ➡️ التالي
  getNext() {
    const next = this.pageNume() + 1;
    this.pageNume.set(next);
    this.loadPage(next);
  }

  // ⬅️ السابق
  getPrevious() {
    const prev = this.pageNume() - 1;

    if (prev < 1) return;

    this.pageNume.set(prev);
    this.loadPage(prev);
  }

  // 🔢 صفحة معينة
  getPage(page: number) {
    if (page < 1) return;

    this.pageNume.set(page);
    this.loadPage(page);
  }

  // 🏷 فلتر
  getFiletr(catog: string) {
    this.catogery.set(catog);
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}