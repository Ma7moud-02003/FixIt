import { Component, EventEmitter, inject, input, OnDestroy, Output, signal } from '@angular/core';
import { Alerts } from '../../../../Alerts/alerts';
import { Subscription } from 'rxjs';
import { Service } from '../../../../../Core/Services/service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-worker-inprocess',
  imports: [],
  templateUrl: './worker-inprocess.html',
  styleUrl: './worker-inprocess.css',
})
export class WorkerInprocess implements OnDestroy{
  private alert=inject(Alerts);
  private subs=new Subscription();
  private service=inject(Service);

  clientName=input<string>('');
  serviceId=input<string>('');
  @Output() submitted=new EventEmitter<void>();

selectedFile!:File;
imagePreview=signal<string>('');

onFileSelected(event:any)
{
  const file=event.target.files[0];
  if(!file&&file.type.startWith('image/'))
  {  
  this.alert.error('قم باختيار صوره  لا عير ')
return;
  }
  this.selectedFile=file;
  const reader=new FileReader();
  reader.onload=()=>{
    this.imagePreview.set(reader.result as string)
  }
  reader.readAsDataURL(file);

}

    submittTask() {
if(!this.selectedFile||!this.imagePreview())
{
  this.alert.error('قم باختيار صوره اولا');
  return
}
      const formData=new FormData();
      formData.append('SubmitedImgUrl',this.selectedFile)
      this.alert.confirmAccepting('هل انت متاكد من تسليم المهمه').then(res => {
        if (res.isConfirmed) {
          this.subs.add(
            this.service.submitTheTask(this.serviceId(),formData).subscribe({
              next: () => {
               this.submitted.emit();
                Swal.fire({
  
                  title: 'تم التسليم',
                  text: 'تم ارسال تسليم المهمه بنجاح في انتظار  تاكيد العميل',
                  icon: 'success'
                })
              }
            })
          )
        }
      })
    }
  
    cancleTask()
    {
      this.subs.add(
        this.service.canceledServiec(this.serviceId()).subscribe({
          next:()=>{
            this.alert.sucsess('تم الغاء المهمه 👍');
            this.submitted.emit();
          }
        })
      )
    }
    ngOnDestroy(): void {
  this.subs.unsubscribe();
      
    }
}
