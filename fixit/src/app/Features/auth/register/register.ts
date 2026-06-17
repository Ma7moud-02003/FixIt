import { Component, inject, OnDestroy, signal } from '@angular/core';
import { RegisetrModel } from '../../../Shared/Models/regiserModel';
import {email, form,FormField, minLength, pattern, required} from '@angular/forms/signals';
import { Auth } from '../../../Core/Services/auth';
import { Subscription } from 'rxjs';
import { Router, RouterLink } from "@angular/router";
import { Alerts } from '../../../Shared/Alerts/alerts';
import { Navbefor } from "../../../Shared/Components/navbefor/navbefor";
@Component({
  selector: 'app-register',
  imports: [FormField, RouterLink, Navbefor],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register implements OnDestroy{
 
private _auth=inject(Auth);
private router=inject(Router);
private subs=new Subscription();
private alert=inject(Alerts);
  famousCities = signal([
    'القاهرة',
    'الإسكندرية',
    'الجيزة',
    'المنصورة',
    'طنطا',
    'دمنهور',
    'الزقازيق',
    'بورسعيد',
    'السويس',
    'الأقصر',
    'أسوان',
    'الغردقة',
    'شرم الشيخ',
    'المنيا',
    'أسيوط'
  ]);
registerModel=signal<RegisetrModel>({
  name:'',
  email:'',
  password:'',
  phone:'',
  confirmPassword:'',
  role:'client',
  city:''
})
regiterForm=form(this.registerModel,(schemapath)=>{
required(schemapath.name,{message:'الاسم مطلوب '});
required(schemapath.email,{message:'البريد الالكتروني مطلوب '});
required(schemapath.city,{message:'المدينه مطلوبه '});
required(schemapath.password,{message:'كلمة السر  مطلوب '});
required(schemapath.confirmPassword,{message:'تاكيد كلمة السر  مطلوب '});
required(schemapath.phone,{message:'رقم الهاتف مطلوب  '});
email(schemapath.email,{message:'بريد الكتروني غير صالح'});
minLength(schemapath.password,5,{message:'اقل شئ 5 احرف '});
minLength(schemapath.name,15,{message:'اقل شئ 15 حرف  '});
 pattern(
    schemapath.password,
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
    { message: 'الباسورد لازم يحتوي على حرف كبير وصغير ورقم' }
  );
pattern(
  schemapath.phone,
  /^01[0125][0-9]{8}$/,
  { message: 'رقم الهاتف غير صالح' }
);
});

showAndHidePassword(pass:HTMLInputElement)
{
  if(pass.type=='password')
  pass.type='text';
 else
pass.type='password'
}



isLoading = signal(false);
submitForm(role:HTMLInputElement,agreed:HTMLInputElement)
{
  if(this.isLoading()) return;
  if(!agreed.checked)
{
    alert('يرجي الموافقه علي سياسة الخصوصية');
    return;
}
  if(role.checked)
  this.regiterForm.role().value.set('worker');
  else
  this.regiterForm.role().value.set('client');

 this.isLoading.set(true)

this.subs.add(this._auth.register(this.regiterForm().value()).subscribe({
  next:(res)=>{
  this.isLoading.set(false);
this.router.navigate(['/wait'], { queryParams: { mode: 'register' } });
console.log(res);
console.log(typeof(res));
  },error: (err) => {
    console.log(err);
    
        // حبل الأمان: لو السيرفر رجع 400 أو 500 أو أي إيرور، اللودر هيقفل فوراً هنا
        this.isLoading.set(false);
  }
  ,complete:()=>{
    this.isLoading.set(false)
  }
})
)
  console.log(this.regiterForm().value());
}
 ngOnDestroy(): void {
  this.subs.unsubscribe();
  }
}
