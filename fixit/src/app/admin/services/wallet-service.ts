import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WalletService {


  private readonly baseUrl = 'Admin/payment';
 
  constructor(private readonly http: HttpClient) {}
 
  getAllWithdrawRequests(
    pageNum: number,
    pageSize: number
  ): Observable<any> {
    const params = new HttpParams()
      .set('pageNum', pageNum)
      .set('pageSize', pageSize);
 
    return this.http.get<any>(
      `${environment.apiUrl}/${this.baseUrl}/withdraw-requests`,
      { params }
    );
  }
 
  getAllDeposits(
    pageNum: number,
    pageSize: number
  ): Observable<any> {
    const params = new HttpParams()
      .set('pageNum', pageNum)
      .set('pageSize', pageSize);
 
    return this.http.get<any>(
      `${environment.apiUrl}/${this.baseUrl}/AllDeposit`,
      { params }
    );
  }
 
  getAllTransactions(
    pageNum: number,
    pageSize: number
  ): Observable<any> {
    const params = new HttpParams()
      .set('pageNum', pageNum)
      .set('pageSize', pageSize);
 
    return this.http.get<any>(
      `${environment.apiUrl}/${this.baseUrl}/AllTransactions`,
      { params }
    );
  }
}
