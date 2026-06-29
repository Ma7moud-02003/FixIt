import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ReportsService {
  private http=inject(HttpClient);
   getAllReports(){
    return this.http.get(`${environment.apiUrl}/Report/All Reports`);
   }
   resolve(id:string,resolve:any){
    return this.http.put(`${environment.apiUrl}/Report/Resolve/${id}`,resolve);

   }

   getSingleReport(id:string){
    return this.http.get(`${environment.apiUrl}/Report/GetReport/${id}`);

   }
}
