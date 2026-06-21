
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


 
chargeWallet(amount: number, method: 'card' | 'wallet'): Observable<{ paymentUrl: string }> {
  // تكوين الـ Query Parameters
  console.log(amount,method);
  
  const params = new HttpParams()
    .set('amount', amount.toString())
    .set('paymentMethod', method);

  return this.http.post<{ paymentUrl: string }>(`${this.apiUrl}/charge-wallet`, {}, { params });
}

 
  withdrawRequest(amount: number,method:'card'|'wallet'): Observable<any> {
    console.log(amount,method);
    
      const params = new HttpParams()
    .set('amount', amount.toString())
    .set('method', method);
  return this.http.post<{ paymentUrl: string }>(`${this.apiUrl}/withdraw-request`, {}, { params });


  }

 
  checkPaymentCallback(queryParams: any): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/Payment/callback`, { params: queryParams });
  }

  getMyTransaction():Observable<any>{
    return this.http.get(`${this.apiUrl}/AllPaymentsForUser`);
  }
}
