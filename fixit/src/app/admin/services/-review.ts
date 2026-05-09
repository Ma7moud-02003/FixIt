import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ReviewService {
  private _http=inject(HttpClient);

  getAllRev(pNum:number=1,Psize:number=10):Observable<any>{
    return this._http.get(`${environment.apiUrl}/Admin/AllReviewsAdmin?PageNum=${pNum}&PageSize=${Psize}`);

  }
   deleteRev(id:number){
    return this._http.delete(`${environment.apiUrl}/Review/DeleteReview/${id}`);
    
  }
}
