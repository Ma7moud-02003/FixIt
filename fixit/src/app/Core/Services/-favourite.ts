import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Favourite {
  http=inject(HttpClient);


  addToFavourite(workerId:string){  
    return this.http.post(`${environment.apiUrl}/Favorite/AddFavorite/${workerId}`,{});
  }

  removeFromFavourite(workerId:string){
    return this.http.delete(`${environment.apiUrl}/Favorite/DeleteFavorite/${workerId}`);
  }

  getFavourites():Observable<any>{
   return this.http.get(`${environment.apiUrl}/Favorite/ClientFavorites`);
  
  }
   
}

