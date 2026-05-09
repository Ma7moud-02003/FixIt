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
  private cache = new Map<number, MyServiceModel[]>();
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

  // 🚀 تحميل الصفحة (مع كاش)
  loadPage(page: number) {

    // ✅ لو موجود في الكاش
    if (this.cache.has(page)) {
      this.myServices.set(this.cache.get(page)!);
      return;
    }

    // 🔄 لو مش موجود → اضرب API
    this.showLoading.set(true);

    if (this.role() == UserRole.Clien_Role) {
      this.subs.add(
        this._services.getSendedServices(page,10).pipe(
          finalize(() => this.showLoading.set(false))
        ).subscribe({
          next: (res) => {
            this.cache.set(page, res.data); // 💾 خزّن
            this.myServices.set(res.data);
          },
          error: (err) => console.log(err)
        })
      );
    } else if (this.role() == UserRole.Worker_Role) {
      console.log('worker');

      this.subs.add(
        this._services.getResivedServices(page,10).pipe(
          finalize(() => this.showLoading.set(false))
        ).subscribe({
          next: (res) => {
            this.cache.set(page, res.data); // 💾 خزّن
            this.myServices.set(res.data);
          },
          error: (err) => console.log(err)
        })
      );
    }

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