import { Component, inject, NgZone, signal } from '@angular/core';
import { FormControl, FormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { Navbefor } from '../../../Shared/Components/navbefor/navbefor';
import { Auth } from '../../../Core/Services/auth';
import { Alerts } from '../../../Shared/Alerts/alerts';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-forget-passwored',
  imports: [Navbefor,RouterModule,CommonModule,FormsModule],
  templateUrl: './forget-passwored.html',
  styleUrl: './forget-passwored.css',
})
export class ForgetPasswored {
  private router = inject(Router);
  private auth = inject(Auth);
  private alerts=inject(Alerts);
  isLoading = signal<boolean>(false);
  private subs = new Subscription();
emailControl=signal<string>('');
  // حقل الإدخال مع التحقق من صحة الإيميل
  sendResetLink() {
    this.isLoading.set(true);
    this.subs.add(
      this.auth.sendEmail(this.emailControl()).subscribe({
        next:()=>{
          this.alerts.sucsess('تم ارسال رابط اعادة التعيين بنجاح')
this.router.navigate(['/wait'], { queryParams: { mode: 'password' } });
        },error:(err)=>{
          console.log(err);
    this.isLoading.set(false);

          
        }
      })
    )

}
}

