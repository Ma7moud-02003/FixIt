

import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ClientServices {
  private _http=inject(HttpClient);
  
  getWorkers(pageNum:number=1,pageSize:number=10):Observable<any>
  {
       return this._http.get(`${environment.apiUrl}/Worker/AllWorkers?PageNum=${pageNum}&PageSize=${pageSize}`)
  }



}
