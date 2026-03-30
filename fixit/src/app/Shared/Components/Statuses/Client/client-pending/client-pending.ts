import { Component, EventEmitter, inject, input, Output, signal } from '@angular/core';
import { Alerts } from '../../../../Alerts/alerts';
import { Subscription } from 'rxjs';
import { Service } from '../../../../../Core/Services/service';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-client-pending',
  imports: [FormsModule],
  templateUrl: './client-pending.html',
  styleUrl: './client-pending.css',
})
export class ClientPending {
    alert=inject(Alerts);
  private subs=new Subscription();
  private service=inject(Service);
  serviceId=input<string>('');
  @Output() accepted=new EventEmitter<void>();
  @Output() reject=new EventEmitter<void>();

address=signal<string>('');

  price=input<number>();
   acceptPrice() {
     this.alert.confirmAccepting('هل انت متاكد انك تريد ان توافق علي السعر ').then(res => {
       if (res.isConfirmed) {
         this.subs.add(
           this.service.acceptPrice(this.serviceId(),this.address()).subscribe({
             next: () => {
        this.accepted.emit();
               Swal.fire({
                 title: 'تمت الموافقه',
                 text: 'تمت  الموفقه علي السعر بنجاح يمكنك الان التواصل مع العامل ',
                 icon: 'success'
               })
             }
           })
         )
       }
     })
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
                     title = 'تم رفض السعر بنجاح ';
                     text = 'تم رفض السعر بنجاح يرجي محاولة التفاوض علي السعر قبل اتخاذ قرار الرفض'
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
}
