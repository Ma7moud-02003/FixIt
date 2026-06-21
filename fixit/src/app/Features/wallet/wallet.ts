import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { PayMentService } from '../../Core/Services/wallet';
import { Alerts } from '../../Shared/Alerts/alerts';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Auth } from '../../Core/Services/auth';
import { Subscription } from 'rxjs';
// الداتا الخام القادمة من الـ API
export interface TransactionAPI {
  id?: string | number;     // لو السيرفر بيبعت معرّف للعملية
  amount: number;           // المبلغ
  createdAt: string;        // التاريخ "2026-06-21T02:46:02..."
  gateway: string;          // بوابة الدفع مثل "Paymob"
  paymentType: number;      // 0 = إيداع، 1 = سحب (أو حسب الـ Business Logic)
  status?: string;          // الحالة لو موجودة، وإلا سنعتمدها Completed تلقائياً
}

// الداتا المنسقة الجاهزة للعرض في الـ UI
export interface TransactionUI {
  id: string;
  amountText: string;
  isDeposit: boolean;
  dateText: string;
  gateway: string;
  typeText: string;
  statusClass: string;
  statusText: string;
}
@Component({
  selector: 'app-wallet',
  imports: [CommonModule,FormsModule],
  templateUrl: './wallet.html',
  styleUrl: './wallet.css',
})
export class Wallet implements OnInit,OnDestroy{
  ngOnDestroy(): void {
    this.subs.unsubscribe();

  }

  // داخل الـ Component class:
isChargeOpen = signal<boolean>(false);
isWithdrawOpen = signal<boolean>(false);

toggleCharge() {
  this.isChargeOpen.update(v => !v);
}

toggleWithdraw() {
  this.isWithdrawOpen.update(v => !v);
}
  role=signal<string>('');
  private subs=new Subscription();
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
    this.getMyTransaction();
  }

  // 1. تحميل بيانات المحفظة أول ما الشاشة تفتح
  loadWalletData() {
    this.isLoading.set(true);
    this.subs.add(this.paymentService.getMyWallet().subscribe({
      next: (res:any) => {
        console.log(res);
        const data=res.data;
        this.walletBalance.set(data.balance);
        // this.transactions.set(res.transactions);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false)
    }));
  }


// عند ضغط الكلاينت على زرار "شحن المحفظة"
onCharge(amount: number, method: 'card' | 'wallet') {
  if (amount <= 0) return;

  this.subs.add(this.paymentService.chargeWallet(amount, method).subscribe({
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
  }));
}

  // 3. عند ضغط الوركر على "طلب سحب"
  onWithdraw(amount: number,method:'card'|'wallet') {
    
    
   this.subs.add( this.paymentService.withdrawRequest(amount,method).subscribe({
      next: (res) => {
        console.log(res);
        
        this.alerts.sucsess('تم تقديم طلب السحب بنجاح وفي انتظار موافقة الإدارة');
        this.loadWalletData(); // تحديث البيانات
      }
    }));
    
  }  
  //  private datePipe = inject(DatePipe);
  getMyTransaction() {
    this.subs.add(
      this.paymentService.getMyTransaction().subscribe({
        next: (res:any) => {
          if (!res.data || res.data.length === 0) {
            this.transactions.set([]);
            return;
          }

          // تحويل الداتا الخام إلى شكل منسق وجاهز للـ UI مباشرة
          const formattedData: TransactionUI[] = res.data.map((item:any, index:number) => {
            const isDeposit = item.paymentType === 0; // 0 إيداع، أي حاجة تانية سحب
            
            return {
              id: item.id ? `#${item.id}` : `#TRX-${1000 + index}`, // لو مفيش ID هنعمل ID وهمي من الـ index
              amountText: `${isDeposit ? '+' : '-'}${item.amount} ج.م`,
              isDeposit: isDeposit,
              // تنسيق التاريخ ليكون: 21 يونيو 2026 - 02:46 م
              dateText:  item.createdAt,
              gateway: item.gateway,
              typeText: isDeposit ? 'شحن رصيد المحفظة' : 'سحب من المحفظة',
              // تنسيق الـ Badges للحالة
              statusText: item.status === 'Failed' ? 'فشلت' : 'ناجحة',
              statusClass: item.status === 'Failed' 
                ? 'bg-rose-50 text-rose-700 border-rose-200' 
                : 'bg-emerald-50 text-emerald-700 border-emerald-200'
            };
          });

          this.transactions.set(formattedData);
        },
        error: (err) => {
          console.error('حدث خطأ أثناء جلب المعاملات:', err);
        }
      })
    );
  }

}
