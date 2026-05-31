import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Auth } from '../../../Core/Services/auth';

@Component({
  selector: 'app-confirm-email',
  imports: [],
  templateUrl: './confirm-email.html',
  styleUrl: './confirm-email.css',
})
export class ConfirmEmail {
  private route = inject(ActivatedRoute);
  

  // حالات الصفحة: جاري التحميل، نجاح التفعيل، أو خطأ (التوكن بايز أو منتهي)
  status = signal<'loading' | 'success' | 'error'>('loading');

  ngOnInit() {
    // قراءة الباراميترز القادمة من رابط الجيميل
    this.route.queryParams.subscribe(params => {
      const token = params['token'];
      const userId = params['userId'];

      if (token && userId) {
        this.verifyAccount(token, userId);
      } else {
        this.status.set('error'); // لو الرابط مبعوت ناقص من الجيميل
      }
    });
  }
  authService=inject(Auth);
// داخل الـ Component في دالة ngOnInit أو دالة مخصصة:
verifyAccount(token: string, userId: string) {
  this.authService.verifyAccount(token, userId).subscribe({
    next: (response) => {
      console.log(response);
      this.status.set('success'); // التفعيل تم بنجاح
    },
    error: (err) => {
      console.error(err);
      this.status.set('error'); // حصل مشكلة أو التوكن بايز
    }
  });
}
  
}
