import { Component, computed, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { ServiceCard } from "../../../../Shared/Components/sendend-service-card/service-card";
import { Service } from '../../../../Core/Services/service';
import { SendedServiceRequestModel } from '../../../../Shared/Models/sendedSrciveModel';
import { finalize, Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Skeleton } from "../../../../Shared/Components/skeleton/skeleton";

@Component({
  selector: 'app-my-sended-services',
  imports: [CommonModule, ServiceCard, Skeleton],
  templateUrl: './my-sended-services.html',
  styleUrl: './my-sended-services.css',
})
export class MySendedServices implements OnInit, OnDestroy {

  catogery = signal<string>('');
  statuses = signal<any[]>([
    { name: 'الكل', value: '' },
    { name: 'مرسله', value: 'priceprocess' },
    { name: 'معلقه', value: 'pending' },
    { name: 'ملغاه', value: 'rejected' },
    { name: 'تم التسليم', value: 'submitted' },
    { name: 'مكتمله', value: 'completed' },
    { name: 'جار الاصلاح', value: 'disputed' }



  ])



  subs = new Subscription();
  _services = inject(Service);
  showLoading = signal<boolean>(true);
  myServices = signal<SendedServiceRequestModel[]>([]);

  ngOnInit(): void {
    this.getMyServices();
  }
  filterdServices = computed(() => {
    if (!this.catogery())
      return this.myServices()
    else
      return this.myServices().filter(item => item.state === this.catogery())
  })



  getMyServices() {
    this.subs.add(

      this._services.getSendedServices().pipe(
        finalize(() => {
          this.showLoading.set(false);
        })
      ).subscribe({
        next: (res) => {
          this.myServices.set(res.data);
          console.log(res.data);
        },

      },
      )
    )
  }
  getFiletr(catog: string) {
    this.catogery.set(catog);
  }
  ngOnDestroy(): void {
    this.subs.unsubscribe()
  }
}

