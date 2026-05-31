import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';

@Component({
  selector: 'app-wait-for-confirm',
  imports: [CommonModule,RouterModule],
  templateUrl: './wait-for-confirm.html',
  styleUrl: './wait-for-confirm.css',
})
export class WaitForConfirm implements OnInit{
  private route = inject(ActivatedRoute);

  // السجنال دي هتحفظ نوع الصفحة: 'register' أو 'password'
  mode = signal<'register' | 'password'>('register');
  ngOnInit() {
    // نقرأ الـ queryParams من الرابط
    this.route.queryParams.subscribe(params => {
      if (params['mode'] === 'password') {
        this.mode.set('password');
      } else {
        this.mode.set('register'); // الافتراضي لو مفيش باراميتر
      }
    });
  }
}
