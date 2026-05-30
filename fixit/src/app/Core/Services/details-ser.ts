import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class DetailsSer {
  private http=inject(HttpClient);

getWorkerDetails(type: string) {
  return this.http.get(
    `${environment.apiUrl}/Worker/GetLast/3/${type}`
  );
}
getNumbers(type: string){
   return this.http.get(
    `${environment.apiUrl}/Worker/GetLast/${type}`
  );
}
}
