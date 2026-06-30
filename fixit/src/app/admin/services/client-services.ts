import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ClientServices {
  private _http=inject(HttpClient);
  
  getUsers(pageNum:number=1,pageSize:number=10):Observable<any>
  {
       return this._http.get(`${environment.apiUrl}/Admin/AllUsers?PageNum=${pageNum}&PageSize=${pageSize}`)
  }

  deletUser(userId:string){
    return this._http.delete(`${environment.apiUrl}/Admin/DeleteUser/${userId}`)
  }
  blockUser(userId:string){
    return this._http.put(`${environment.apiUrl}/Admin/BlockUser/${userId}`,{});
  }

}
