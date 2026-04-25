import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, input, OnDestroy, Output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Service } from '../../../../../Core/Services/service';
import { Alerts } from '../../../../Alerts/alerts';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-worker-priceprocess',
  imports: [CommonModule,FormsModule],
  templateUrl: './worker-priceprocess.html',
  styleUrl: './worker-priceprocess.css',
})
export class WorkerPriceprocess implements OnDestroy{
  private service=inject(Service);
  private subs=new Subscription();
  totalPrice=signal<number>(0);
  serviceId=input<string>('');
  private alert=inject(Alerts);
  @Output() priceSent = new EventEmitter<void>();
  @Output() reject = new EventEmitter<void>();

  sendPrice(event: any) {
    console.log('sending');

   this.subs.add(this.service.addPriceForService( this.totalPrice() , this.serviceId()).subscribe({
      next: () => {
        event.innerText = 'إرسال عرض السعر';
        this.alert.sucsess('تم ارسال السعر بنجاح');
        this.priceSent.emit(); 
      }
    }))
  }

    rejectService() {
      this.alert.confirmAccepting('هل انت متاكد انك تريد رفض  الخدمه').then(res => {
        if (res.isConfirmed) {
          this.subs.add(
            this.service.rejectService(this.serviceId()).subscribe({
              next: () => {
             this.reject.emit();
                let text = '';
                let title = '';
                  title = 'تم رفض الخده بنجاح ';
                  text = 'تم رفض الخدمه كثرة رفض الخدمات ليس جيدا للحفاظ علي تقييم جيد'
                Swal.fire({
  
                  title: title,
                  text: text,
                  icon: 'success'
                })
              }
            })
          )
        }
      })
    }
    ngOnDestroy(): void {
      this.subs.unsubscribe();
    }
}
