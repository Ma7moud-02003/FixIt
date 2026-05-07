import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Service } from '../../Core/Services/service';
import { Subscription } from 'rxjs';
import { ServiceDetailsModel } from '../../Shared/Models/serviceDetails';
import { FormDatePipe } from '../../Shared/Pipes/form-date-pipe';
import { ServiceStatus } from '../../Shared/enums/status';
import { CommonModule } from '@angular/common';
import { Auth } from '../../Core/Services/auth';
import { UserRole } from '../../Shared/enums/role';
import { Alerts } from '../../Shared/Alerts/alerts';
import { FormsModule } from '@angular/forms';
import { Skeleton } from "../../Shared/Components/skeleton/skeleton";
import Swal from 'sweetalert2';
import { KnobModule } from 'primeng/knob';
import { ClientPriceProcess } from "../../Shared/Components/Statuses/Client/client-price-process/client-price-process";
import { ClientPending } from "../../Shared/Components/Statuses/Client/client-pending/client-pending";
import { ClientInprocess } from "../../Shared/Components/Statuses/Client/client-inprocess/client-inprocess";
import { ClientSubmitted } from "../../Shared/Components/Statuses/Client/client-submitted/client-submitted";
import { WorkerPriceprocess } from "../../Shared/Components/Statuses/Worker/worker-priceprocess/worker-priceprocess";
import { WorkerPending } from "../../Shared/Components/Statuses/Worker/worker-pending/worker-pending";
import { WorkerSubmitted } from "../../Shared/Components/Statuses/Worker/worker-submitted/worker-submitted";
import { WorkerInprocess } from "../../Shared/Components/Statuses/Worker/worker-inprocess/worker-inprocess";
import { Review } from '../../Core/Services/review';

@Component({
  selector: 'app-service-details',
  imports: [FormDatePipe, CommonModule, FormsModule, Skeleton, FormsModule, KnobModule, ClientPriceProcess,
    ClientPending, ClientInprocess, ClientSubmitted,
    WorkerPriceprocess, WorkerPending, WorkerSubmitted,
    WorkerInprocess, RouterLink],
  templateUrl: './service-details.html',
  styleUrl: './service-details.css',
})
export class ServiceDetails implements OnInit, OnDestroy {

  statusValues: Record<string, number> = {
    priceprocess:10,
    pending: 25,
    inprocess: 50,
    rejected: 0,
    cancled: 0,
    submitted: 80,
    completed: 95,
    reviewed:100
    
  }
  // important part 
  statuses = ServiceStatus;
  Roles = UserRole;
  statusOfState = signal([
    { status: ['pending', 'inprocess', 'submitted', 'completed'], title: 'في انتظار التسعيير' },
    { status: [ 'canceled'], title: 'تم الغاء الخدمه من قبل الفني' },
    { status: ['rejected',], title: 'تم  الغاء الخدمه من قبل احد الطرفين  ' },
    { status: ['pending', 'inprocess', 'submitted', 'completed'], title: 'تم التسعير ' },
    { status: ['inprocess', 'submitted', 'completed'], title: 'تم الموافقه علي السعر ' },
    { status: ['inprocess', 'submitted', 'completed'], title: 'جار التنفيذ' },
    { status: ['submitted', 'completed'], title: 'تم التسليم' },
    { status: ['completed'], title: 'مكتمله' },
    { status: ['reviewed'], title: 'تم مراجعة الخدمة' },

  ])
  value = signal<number>(0);
  totalPrice = signal<number>(0);
  alert = inject(Alerts)
  serviceDetails = signal<ServiceDetailsModel>({} as ServiceDetailsModel);
  auth = inject(Auth);
  role = signal<string>('')
  router = inject(ActivatedRoute);
  private subs = new Subscription();
  service = inject(Service);
  id = signal<string>('');

  ngOnInit(): void {

    this.role.set(this.auth.getRole() || '');
    console.log(this.role());

    this.subs.add(this.router.paramMap.subscribe({
      next: (res) => {
        this.id.set(res.get('id') || '');
        console.log(this.id());
        if (this.role() == this.Roles.Worker_Role)
       {
        console.log('woooooooooooorker');
        
         this.getRecivedServiveDetails();

       }
        else if (this.role() == this.Roles.Clien_Role)
          this.getSendedServiveDetails();

      }
    }))
  }

  showPageDetails = signal<boolean>(false);

  getRecivedServiveDetails() {
    this.subs.add(this.service.getRecivedServiceDetails(this.id()).subscribe({
      next: (res) => {
        console.log(res.data);
        
        this.showPageDetails.set(true);
        this.serviceDetails.set(res.data);
        this.returnStatusValue(this.serviceDetails().state);


      }
    }))
  }

  returnStatusValue(status: string) {
    this.value.set(this.statusValues[status] ?? 0);
  }

  // client work
  getSendedServiveDetails() {
    this.subs.add(this.service.getSendedServiceDetails(this.id()).subscribe({
      next: (res) => {
        this.showPageDetails.set(true);
        this.serviceDetails.set(res.data);
        this.returnStatusValue(this.serviceDetails().state);

        console.log(res);
      }
    }))
  }




  cancelService() {
    this.alert.confirmAccepting('هل انت متاكد انك تريد الغاء الخدمه').then(res => {
      if (res.isConfirmed) {
        this.subs.add(
          this.service.canceledServiec(this.serviceDetails().serviceId).subscribe({
            next: () => {
              this.getRecivedServiveDetails();
              Swal.fire({

                title: 'تم الغاء الخدمه بنجاح ',
                text: 'تم الغاء الخدمه بنجاح  ملحوظه الغاء خدمة العملاء ليس جيدا ',
                icon: 'success'
              })
            }
          })
        )
      }
    })
  }



rating=signal<number>(0);
comment=signal<string>('')
setRating(star:number)
{
  this.rating.set(star);
}

private _review=inject(Review);
getRateing()
{
  console.log(this.rating(),this.comment());
const rate={
  rate:this.rating(),comment:this.comment()
}
this.subs.add(
  this._review.addReview(rate,this.serviceDetails().serviceId).subscribe({
    next:()=>{
this.alert.sucsess('تم اضافة تقييمك 👏 لا تجعل الامر يتوقف هنا اطلب المزيد');
this.getSendedServiveDetails();
    }
  })
)

  
}






  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

}
