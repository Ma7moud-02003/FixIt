
import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
export interface WalletResponse {
  balance: number;
  transactions: any[]; // يمكنك تخصيصها بناءً على شكل الـ transaction من الباك إند
}

export interface WithdrawRequest {
  amount: number;
  paymentMethod: string;
  accountDetails: string;
}
@Injectable({
  providedIn: 'root',
})
export class PayMentService {
  // استخدام inject بدلاً من الـ Constructor بالطريقة الحديثة
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/Payment`; // المسار الأساسي للـ Payment API

  /**
   * 1. جلب بيانات المحفظة الحالية والعمليات السابقة (مشترك للكلاينت والوركر)
   */
  getMyWallet(): Observable<WalletResponse> {
    return this.http.get<WalletResponse>(`${this.apiUrl}/myWallet`);
  }


/**
 * شحن المحفظة عبر تمرير المبلغ والطريقة كـ Query Parameters
 * @param amount المبلغ المراد شحنه
 * @param method طريقة الدفع المحددة (wallet أو card)
 */
chargeWallet(amount: number, method: 'card' | 'wallet'): Observable<{ paymentUrl: string }> {
  // تكوين الـ Query Parameters
  const params = new HttpParams()
    .set('amount', amount.toString())
    .set('paymentMethod', method);

  // نرسل الـ params، ونترك الـ Body فارغاً {} لأنها دالة POST
  return this.http.post<{ paymentUrl: string }>(`${this.apiUrl}/charge-wallet`, {}, { params });
}

  /**
   * 3. طلب سحب الأرباح (خاص بالـ Worker)
   * @param request بيانات طلب السحب (المبلغ، الطريقة، تفاصيل الحساب)
   */
  withdrawRequest(amount: number,method:'card'|'wallet'): Observable<any> {
    console.log(amount,method);
    
      const params = new HttpParams()
    .set('amount', amount.toString())
    .set('method', method);
  return this.http.post<{ paymentUrl: string }>(`${this.apiUrl}/withdraw-request`, {}, { params });


  }

  /**
   * 4. الـ Callback الخاص بالدفع (عند العودة للموقع)
   * في الغالب الباك إند بيحتاجه، لو هتحتاج تنادي عليه من الـ Front-end لتأكيد حالة العملية
   */
  checkPaymentCallback(queryParams: any): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/callback`, { params: queryParams });
  }
}
