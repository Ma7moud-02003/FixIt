import { Component, inject, OnInit, signal } from '@angular/core';
import { RequiredServiceModel } from '../../../../Shared/Models/requireService';
import { form, required, FormField } from '@angular/forms/signals';
import { Subscription } from 'rxjs';
import { Service } from '../../../../Core/Services/service';
import { Alerts } from '../../../../Shared/Alerts/alerts';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-require',
  imports: [FormField],
  templateUrl: './require.html',
  styleUrl: './require.css',
})
export class Require implements OnInit {
  private rout = inject(Router);

  ngOnInit(): void {
    this.subs.add(
      this.router.paramMap.subscribe({
        next: (res) => {
          this.workerId.set(res.get('workerId') || '')
        }
      })
    )
  }
  workerId = signal<string>('');
  private router = inject(ActivatedRoute);
  private _service = inject(Service);
  alerts = inject(Alerts);
  private subs = new Subscription();
  addServiceModel = signal<RequiredServiceModel>({
    serviceTitle: '',
    serviceDescription: ''
  })

  addServiceForm = form(this.addServiceModel, (schemaPath) => {
    required(schemaPath.serviceTitle, { message: 'العنوان مطلوب' })
    required(schemaPath.serviceDescription, { message: 'الوصف مطلوب' })
  })

  // addService(event: Event) {
  //   event.preventDefault();
  //   const formValue = this.addServiceForm().value();
  //   if (formValue !== undefined && formValue !== null && this.workerId() !== null) {
  //     this.subs.add(
  //       this._service.creatService(formValue, this.workerId()).subscribe({
  //         next: (res) => {
  //           console.log(res);
  //           this.alerts.sucsess('تم تسليم الخدمه بنجاح 👍');
  //           this.rout.navigate(['/mainLayout/search'])
  //           this.clearForm();
  //         }
  //       })
  //     )
  //   }
  // }
  clearForm() {
    this.addServiceModel.update(m => {
      return {
        ...m, serviceTitle: '', serviceDescription: ''
      }
    })
  }

  
// تعريف الحالة
isLoading = signal(false);



  selectedFile!:File;
  imagePreview=signal<string>('');
  onFileSelected(event: Event) {
  const input = event.target as HTMLInputElement;
  if (!input.files || input.files.length === 0) return;
  const file = input.files[0];
  if (!file.type.startsWith('image/')) {
   this.alerts.error('الرجاء اختيار صوره')
    return;
  }
  this.selectedFile = file;
  const reader = new FileReader();
  reader.onload = () => {
    this.imagePreview.set( reader.result as string);
  };
  reader.readAsDataURL(file);
}
requireService(event:Event)
{
  event.preventDefault();
    if (this.addServiceForm().invalid()) return;
    this.isLoading.set(true)
  if (!this.selectedFile) {
 this.alerts.error('اختار صورة الأول');
  return;
}
  const formData = new FormData();
  formData.append('RequestedImgUrl', this.selectedFile)
  formData.append('ServiceTitle',this.addServiceForm.serviceTitle().value());
  formData.append('ServiceDescription',this.addServiceForm.serviceDescription().value());
formData.forEach((value, key) => {
  console.log(key, value);
});
  this.subs.add(
        this._service.creatService(formData, this.workerId()).subscribe({
          next: (res) => {
            console.log(res);
            this.alerts.sucsess('تم تسليم الخدمه بنجاح 👍');
            this.rout.navigate(['/mainLayout/myServices'])
            this.clearForm();
            this.isLoading.set(false);

          },error:()=>(this.isLoading.set(false))
        })
      )
}
}

