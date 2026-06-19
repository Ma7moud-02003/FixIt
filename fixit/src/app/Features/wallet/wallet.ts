import { Component, inject, signal } from '@angular/core';
import { PayMentService } from '../../Core/Services/wallet';
import { Alerts } from '../../Shared/Alerts/alerts';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Auth } from '../../Core/Services/auth';

@Component({
  selector: 'app-wallet',
  imports: [CommonModule,FormsModule],
  templateUrl: './wallet.html',
  styleUrl: './wallet.css',
})
export class Wallet {
  role=signal<string>('');
  private paymentService = inject(PayMentService);
  private alerts = inject(Alerts);
// تأكد أنها مكتوبة كدا بالظبط وليس signal<any[]>(undefined)
  // استخدام Signals لحفظ حالة الرصيد والعمليات
  walletBalance = signal<number>(0);
  transactions = signal<any[]>([]);
  isLoading = signal<boolean>(false);
  private auth=inject(Auth);
  ngOnInit(): void {
    this.loadWalletData();
    this.role.set(this.auth.getRole()||'');
  }

  // 1. تحميل بيانات المحفظة أول ما الشاشة تفتح
  loadWalletData() {
    this.isLoading.set(true);
    this.paymentService.getMyWallet().subscribe({
      next: (res:any) => {
        console.log(res);
        const data=res.data;
        this.walletBalance.set(data.balance);
        // this.transactions.set(res.transactions);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false)
    });
  }


// عند ضغط الكلاينت على زرار "شحن المحفظة"
onCharge(amount: number, method: 'card' | 'wallet') {
  if (amount <= 0) return;

  this.paymentService.chargeWallet(amount, method).subscribe({
    next: (res:any) => {
      console.log(res);
      
     // إعادة توجيه المستخدم لصفحة الدفع الخارجية
      if (res.redirectUrl) {
        window.location.href = res.redirectUrl; 
      }
    },
    error: (err) => {
      console.log(err);
      
      // الـ interceptor يتعامل مع الخطأ ويظهر التنبيه تلقائياً هنا
    }
  });
}

  // 3. عند ضغط الوركر على "طلب سحب"
  onWithdraw(amount: number,method:'card'|'wallet') {
    
    
    this.paymentService.withdrawRequest(amount,method).subscribe({
      next: (res) => {
        console.log(res);
        
        this.alerts.sucsess('تم تقديم طلب السحب بنجاح وفي انتظار موافقة الإدارة');
        this.loadWalletData(); // تحديث البيانات
      }
    });
  }
}
