import { Component, computed, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { ServiceService } from '../../services/-service';
import { ServiceStatus } from '../../../Shared/enums/status';
import { Alerts } from '../../../Shared/Alerts/alerts';
export type ServiceState =
  | 'priceprocess' | 'pending' | 'completed' | 'cancelled' | 'inprocess'|'rejected'|'reviewed'|'disputed';

export interface ServiceDetails {
  clientId: string;
  clientName: string;
  comment: string | null;
  completeDate: string | null;
  createdAt: string;
  depositAmount: number;
  rate: number;
  requestDate: string;
  requestedImgUrl: string | null;
  reviewId: number;
  serviceAddress: string | null;
  serviceDescription: string;
  serviceId: string;
  serviceTitle: string;
  state: ServiceState;
  submitedImgUrl: string | null;
  totalPrice: number;
  workerId: string;
  workerName: string;
}
export interface StatusConfig {
  label: string;
  classes: string;
  dot: string;
}

@Component({
  selector: 'app-ser-details',
  imports: [],
  templateUrl: './ser-details.html',
  styleUrl: './ser-details.css',
})
export class SerDetails implements OnInit,OnDestroy{
  statuses=ServiceStatus;
  private router=inject(ActivatedRoute);
  private subs=new Subscription();
  private _ser=inject(ServiceService);
  serviceId=signal<string>('');
  isLoading = signal(true);
  service = signal<ServiceDetails | null>(null);
  selectedImage = signal<string | null>(null);
  lightboxOpen = signal(false);
  ngOnInit(): void {
    
    this.subs.add(this.router.paramMap.subscribe({
      next:(res)=>{
const id=res.get('id');
this.serviceId.set(id||'');
if(this.serviceId())
  this.getServiceSetails();
      }
    }))
  }

  getServiceSetails()
  {
    this.subs.add(
this._ser.getSerDetails(this.serviceId()).subscribe({
  next:(res:any)=>{
    console.log(res);
    this.service.set(res.data);
    this.isLoading.set(false);
    
  }
})
    )
  }
  readonly statusMap: Record<ServiceState, StatusConfig> = {
    priceprocess: {
      label: 'قيد التسعير',
      classes: 'bg-amber-50 text-amber-700 border border-amber-200',
      dot: 'bg-amber-500',
    },
    pending: {
      label: 'معلق',
      classes: 'bg-slate-50 text-slate-600 border border-slate-200',
      dot: 'bg-slate-400',
    },
    completed: {
      label: 'مكتمل',
      classes: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
      dot: 'bg-emerald-500',
    },
    cancelled: {
      label: 'ملغى',
      classes: 'bg-red-50 text-red-700 border border-red-200',
      dot: 'bg-red-500',
    },
    inprocess: {
      label: 'جارى التنفيذ',
      classes: 'bg-blue-50 text-blue-700 border border-blue-200',
      dot: 'bg-blue-500',
    },
      rejected: {
      label: 'مرفوضه',
      classes: 'bg-red-50 text-red-700 border border-red-200',
      dot: 'bg-red-500',
    },
    reviewed:{
       label: 'تمت مراجعتها',
      classes: 'bg-green-50 text-green-700 border border-green-200',
      dot: 'bg-green-500',
    },
      disputed:{
       label: 'مرسل الي الدعم',
      classes: 'bg-orange-50 text-orange-700 border border-orange-200',
      dot: 'bg-orange-500',
    }
    

  };

  statusConfig = computed(() => {
    const s = this.service();
    if (!s) return null;
    return this.statusMap[s.state] ?? this.statusMap['pending'];
  });

  hasReview = computed(() => {
    const s = this.service();
    return s ? s.reviewId > 0 || s.rate > 0 || !!s.comment : false;
  });

  stars = computed(() =>
    Array.from({ length: 5 }, (_, i) => i < (this.service()?.rate ?? 0))
  );

  skeletonItems = [1, 2, 3, 4, 5, 6];



  formatDate(date: string | null): string {
    if (!date || date.startsWith('0001')) return '—';
    try {
      return new Intl.DateTimeFormat('ar-EG', {
        year: 'numeric', month: 'long', day: 'numeric',
      }).format(new Date(date));
    } catch { return '—'; }
  }

  formatCurrency(amount: number): string {
    if (!amount) return '—';
    return new Intl.NumberFormat('ar-EG', {
      style: 'currency', currency: 'EGP',
    }).format(amount);
  }

  shortId(id: string): string {
    return id ? `#${id.slice(0, 8).toUpperCase()}` : '—';
  }

  openLightbox(url: string | null) {
    if (!url) return;
    this.selectedImage.set(url);
    this.lightboxOpen.set(true);
  }

  closeLightbox() {
    this.lightboxOpen.set(false);
    this.selectedImage.set(null);
  }
 private alerts=inject(Alerts);
 showOperations=signal<boolean>(true);
  resolve(state:string)
  {
      if(this.service()?.serviceId){
    this.subs.add(        
      this._ser.resolveService(this.service()?.serviceId||'',state).subscribe({
        next:(res)=>{

        this.alerts.sucsess('تم  تنفيد الاجراء بنجاح ')
       console.log(res);
       this.showOperations.set(false);
        }
      })
    )}
  }
  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

}
