import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ChatsService {
  private _http=inject(HttpClient);
  getAllChats(pNum:number=1,pSize:number=10):Observable<any>{
    return this._http.get(`${environment.apiUrl}/Admin/AllChats?pageNum=${pNum}&pageSize=${pSize}`);
  }

  getChatMessages(roomId:number):Observable<any>{
    return this._http.get(`${environment.apiUrl}/chat/room/${roomId}`);
  }
  

 
}
