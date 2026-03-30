import { Component, computed, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { Service } from '../../../../Core/Services/service';
import { ServiceCard } from "../../../../Shared/Components/sendend-service-card/service-card";
import { RecivedServiceRequestModel } from '../../../../Shared/Models/RecivedServiceModel';
import { RecivedServiceCard } from "../../../../Shared/Components/resived-service-card copy/service-card";
import { Skeleton } from "../../../../Shared/Components/skeleton/skeleton";
import { finalize, Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-my-recived-services',
  imports: [RecivedServiceCard, Skeleton, CommonModule],
  templateUrl: './my-recived-services.html',
  styleUrl: './my-recived-services.css',
})
export class MyRecivedServices implements OnInit, OnDestroy {
  statuses = signal<any[]>([
    { name: 'الكل', value: '' },
    { name: 'مستلمه', value: 'priceprocess' },
    { name: 'معلقه', value: 'pending' },
    { name: 'ملغاه', value: 'rejected' },
    { name: 'تم التسليم', value: 'submitted' },
    { name: 'مكتمله', value: 'completed' },
    { name: 'جار الاصلاح', value: 'disputed' }



  ])

  subs = new Subscription();
  catogery = signal<string>('');
  _services = inject(Service);
  showLoading = signal<boolean>(true);
  myServices = signal<RecivedServiceRequestModel[]>([]);
  filterdService = computed(() => {
    if (!this.catogery())
      return this.myServices();
    else
      return this.myServices().filter(item => item.state === this.catogery())
  })
  ngOnInit(): void {
    this.getMyRecivedService();
  }

  getMyRecivedService() {
    this.subs.add(
      this._services.getResivedServices().pipe(
        finalize(() => {
          this.showLoading.set(false)
        })).subscribe({
          next: (res) => {

            this.myServices.set(res.data);
            console.log(res.data);
          }
        })

    )
  }
  getFiletr(catog: string) {
    this.catogery.set(catog);
  }
  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
