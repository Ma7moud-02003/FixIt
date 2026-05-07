import { Component, inject, signal } from '@angular/core';
import { LoginModel } from '../../../Shared/Models/loginModel';
import { email, form, minLength, pattern, required, FormField } from '@angular/forms/signals';
import { Auth } from '../../../Core/Services/auth';
import { Subscription } from 'rxjs';
import { Router, RouterLink } from "@angular/router";
import { Alerts } from '../../../Shared/Alerts/alerts';
import { Navbefor } from "../../../Shared/Components/navbefor/navbefor";
import { Skeleton } from "../../../Shared/Components/skeleton/skeleton";
import { User } from '../../../Core/Services/user';
import { UserRole } from '../../../Shared/enums/role';

@Component({
  selector: 'app-login',
  imports: [FormField, RouterLink, Navbefor, Skeleton],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
private router=inject(Router);  
private _auth=inject(Auth);
private _user=inject(User);
private subs=new Subscription();
private alerts=inject(Alerts);
toggleLoginForm=signal<boolean>(false);
loginModel=signal<LoginModel>({

  email:'',
  password:'',

})
loginForm=form(this.loginModel,(schemapath)=>{
required(schemapath.email,{message:'البريد الالكتروني مطلوب '});
required(schemapath.password,{message:'كلمة السر  مطلوب '});
email(schemapath.email,{message:'بريد الكتروني غير صالح'});
// minLength(schemapath.password,5,{message:'اقل شئ 5 احرف '});
//  pattern(
//     schemapath.password,
//     /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
//     { message: 'الباسورد لازم يحتوي على حرف كبير وصغير ورقم' }
//   );
});


showAndHidePassword(pass:HTMLInputElement)
{  
  if(pass.type=='password')
  pass.type='text';
 else
pass.type='password'
}

submitForm(agreed:HTMLInputElement,button:HTMLElement)
{
  button.innerText='.....جار التسجيل';
  if(!agreed.checked)
{
    alert('يرجي الموافقه علي سياسة الخصوصية');
    return;
}
  if(!this.loginForm().valid())
  alert('الحقول مطلوبه')
this.subs.add(this._auth.login(this.loginForm().value()).subscribe({
  next:(res:any)=>{
    console.log(res);
this._auth.userToken.set(res.token||'');
localStorage.setItem('userToken',JSON.stringify(res.token));
this.alerts.sucsess('تم تسجيل الدخول ينجاح');
this.routingTo();

  }
})
)
}

routingTo()
{
this.subs.add(
  this._user.getUserData().subscribe({
    next:(res)=>{
      const role=res.data.role;
      console.log(res);
      localStorage.setItem('user',JSON.stringify(res.data));
      this._auth.userProfileData.set(res.data); 
      if(role==UserRole.Clien_Role)
      this.router.navigate(['/mainLayout/home']);
      else if(role==UserRole.Worker_Role)
    {  
      this.router.navigate(['/dashboared']);}
    
    else if(role==UserRole.Admin_Role)
    {
      this.router.navigate(['/admin']);
    }
    }
  })
)
}
 ngOnDestroy(): void {
  this.subs.unsubscribe();
  }
}

