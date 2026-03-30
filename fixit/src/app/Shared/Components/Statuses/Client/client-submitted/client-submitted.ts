import { Component, EventEmitter, inject, input, Output } from '@angular/core';
import { Alerts } from '../../../../Alerts/alerts';
import { Subscription } from 'rxjs';
import { Service } from '../../../../../Core/Services/service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-client-submitted',
  imports: [],
  templateUrl: './client-submitted.html',
  styleUrl: './client-submitted.css',
})
export class ClientSubmitted {
  alert=inject(Alerts);
  private subs=new Subscription();
  private service=inject(Service);
  serviceId=input<string>('');
@Output() accepted=new EventEmitter<void>();
@Output() disputed=new EventEmitter<void>();



  acceptTask() {
    this.alert.confirmAccepting('هل انت متاكد من انك استلمت المهمه بنجاح').then(res => {
      if (res.isConfirmed) {
        this.subs.add(
          this.service.acceptTask(this.serviceId()).subscribe({
            next: () => {
              this.accepted.emit()
              Swal.fire({

                title: 'تم قبول المهمه بنجاح ',
                text: 'لا تدع الامر يتوقف هنا طلب خدمات اكثر من افضل الفنيين علي الاطلاق ',
                icon: 'success'
              })
            }
          })
        )
      }
    })
  }



 
   DisputedTask() {
     this.alert.confirmAccepting('هل انت متاكد من عدم استلام المهمه ').then(res => {
       if (res.isConfirmed) {
         this.subs.add(
           this.service.disPutedTask(this.serviceId()).subscribe({
             next: () => {
               this.disputed.emit();
               Swal.fire({
 
                 title: 'تمت ارسال الحدمه الي الدعم وجار الفحص',
                 text: 'الدعم سيقوم بمراجعة المهمه والرد عليك في اسرع وقت هدفنا هو امنك والحفاظ علي خدماتك',
                 icon: 'success'
               })
             }
           })
         )
       }
     })
   }
 

}
