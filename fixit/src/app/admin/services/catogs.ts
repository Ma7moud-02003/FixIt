import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class CatogsService {
   private _http=inject(HttpClient);
 getAllCatogs():Observable<any>
{
  return this._http.get(`${environment.apiUrl}/Category/AllCategories`)
}  

editeCategory(id:string,catog:any)
{
  return this._http.put(`${environment.apiUrl}/EditeCategory/${id}`,catog)
}

addCatog(catog:any)
{
  return this._http.post(`${environment.apiUrl}/AddCategory`,catog);
}

deleteCatog(id:string)
{
  return this._http.delete(`${environment.apiUrl}/DeleteCategory/${id}`);
}

}
