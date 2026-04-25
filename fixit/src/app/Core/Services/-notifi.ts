import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class Notifi {
  private http=inject(HttpClient);
  endPoints=signal<string>('Notification');
getMyFavorite(): Observable<any> {
  return this.http.get(`${environment.apiUrl}/${this.endPoints()}/MyNotifications`);
}
readNotification(id: number): Observable<any> {
  return this.http.put(`${environment.apiUrl}/${this.endPoints()}/${id}/read`,id);
}
}