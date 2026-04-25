import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { Subscription } from 'rxjs';
import { Protfolio } from '../../../Core/Services/protfolio';
import { Alerts } from '../../../Shared/Alerts/alerts';
import { form, required, FormField } from '@angular/forms/signals';
import { Router, RouterLink } from '@angular/router';

interface Portfolio {
  Title: string,
  Describtion: string,
}
@Component({
  selector: 'app-portfolio',
  imports: [FormField, RouterLink],
  templateUrl: './portfolio.html',
  styleUrl: './portfolio.css',
})
export class AddPortfolio implements OnInit ,OnDestroy{
  private subs = new Subscription();
  private _portfolio = inject(Protfolio);
  private alerts = inject(Alerts);
  private rout = inject(Router);
  //
  portfolioId = signal<string>('');
  isEditeMode = signal<boolean>(false);
 //

  ngOnInit(): void {
    const work = history.state.work;
    if (work) {
      console.log(work);

      this.isEditeMode.set(true);
      this.portfolioModel.set({
        Title: work.title,
        Describtion: work.description
      });

      this.imagePreview.set(work.imgUrl);
      this.portfolioId.set(work.portfolioId)
    }
  }



  selectedFile!: File;
  imagePreview = signal<string>('');

  portfolioModel = signal<Portfolio>({
    Title: '',
    Describtion: ''
  })

  portfolioForm = form(this.portfolioModel, (schemaPath) => {
    required(schemaPath.Title, { message: ' العنوان مطلوب' });
    required(schemaPath.Describtion, { message: ' العنوان مطلوب' });

  })

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
      this.imagePreview.set(reader.result as string);
    };
    reader.readAsDataURL(file);
  }

  implementFormData(): any {
    if (!this.selectedFile) {
      this.alerts.error('اختار صورة الأول');
      return;
    }
    const formData = new FormData();
    formData.append('ImgUrl', this.selectedFile)
    formData.append('Title', this.portfolioForm.Title().value());
    formData.append('Description', this.portfolioForm.Describtion().value());
    formData.forEach((value, key) => {
      console.log(key, value);
    });
    return formData;
  }

  addPortFolio() {
    this.subs.add(
      this._portfolio.addPortfoio(this.implementFormData()).subscribe({
        next: () => {
          this.alerts.sucsess('تم اضافة العمل بنجاح');
          this.rout.navigate(['/dashboared/myPortfolio']);
        }
      })
    )
  }

  editePortFolio() {
    if (!this.selectedFile) {
      this.alerts.error('اختار صورة الأول');
      return;
    }
    this.subs.add(
      this._portfolio.editePortfolio(this.implementFormData(),this.portfolioId()).subscribe({
        next: () => {
          this.alerts.sucsess('تم تعديل العمل بنجاح  قم باضافة الكثير من الاعمال لجلب عملاء اكثر 👍');
          this.rout.navigate(['/dashboared/myPortfolio']);
        }
      })
    )
  }

  deletePortfolio() {
 this.alerts.confirmDelete('هل انت متأكد من حذف هذا العمل ؟').then((res)=>{
  if(res.isConfirmed)
  {
    this.subs.add(
      this._portfolio.deletePortfolio(this.portfolioId()).subscribe({
        next: () => {
          this.alerts.sucsess('تم حذف العمل بنجاح');
          this.rout.navigate(['/dashboared/myPortfolio']);
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
