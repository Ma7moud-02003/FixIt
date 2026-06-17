import { Component, inject, signal } from '@angular/core';
import { PayMentService } from '../../Core/Services/wallet';
import { Alerts } from '../../Shared/Alerts/alerts';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-wallet',
  imports: [CommonModule,FormsModule],
  templateUrl: './wallet.html',
  styleUrl: './wallet.css',
})
export class Wallet {
  private paymentService = inject(PayMentService);
  private alerts = inject(Alerts);
// تأكد أنها مكتوبة كدا بالظبط وليس signal<any[]>(undefined)
  // استخدام Signals لحفظ حالة الرصيد والعمليات
  walletBalance = signal<number>(0);
  transactions = signal<any[]>([]);
  isLoading = signal<boolean>(false);

  ngOnInit(): void {
    this.loadWalletData();
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
    next: (res) => {
      // إعادة توجيه المستخدم لصفحة الدفع الخارجية
      if (res.paymentUrl) {
        window.location.href = res.paymentUrl; 
      }
    },
    error: (err) => {
      console.log(err);
      
      // الـ interceptor يتعامل مع الخطأ ويظهر التنبيه تلقائياً هنا
    }
  });
}

  // 3. عند ضغط الوركر على "طلب سحب"
  onWithdraw(amount: number) {
    const requestData = { amount, paymentMethod: 'Vodafone Cash', accountDetails: '010xxxxxxx' };
    
    this.paymentService.withdrawRequest(requestData).subscribe({
      next: (res) => {
        this.alerts.sucsess('تم تقديم طلب السحب بنجاح وفي انتظار موافقة الإدارة');
        this.loadWalletData(); // تحديث البيانات
      }
    });
  }
}
