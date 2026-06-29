import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ServiceService {
  private _http=inject(HttpClient);

  getAllServices(pNum:number=1,pSize:number=10):Observable<any>
  {
  return this._http.get(`${environment.apiUrl}/Admin/AllServiceRequests?pageNum=${pNum}&pageSize=${pSize}`);
  }
  getSerDetails(id:string)
  {
  return this._http.get(`${environment.apiUrl}/Service/Details/${id}`);
  }
  resolveService(id:string,state:string)
  {
    return this._http.put(`${environment.apiUrl}/Service/Admin/${id}/resolve?state=${state}`,{});
  }
}
