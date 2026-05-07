import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
interface ReportErrors {
  title: string|null;
  description: string|null;
  reportType: number|null;
}
@Injectable({
  providedIn: 'root',
})
export class ReportsService {
  private _http = inject(HttpClient);



  sendReport(report: ReportErrors,userId:string) {
    return this._http.post(`${environment.apiUrl}/Report/Submit/${userId}`, report);
  }

getMyReports():Observable<any>
{
    return this._http.get(`${environment.apiUrl}/Report/All Reports`);

}

}