import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {  ChangePasswordRequest, EditProfileRequest } from '../Model/adminProfile';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
   private readonly http = inject(HttpClient);
  getProfile(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/Admin/Profile`)
  }
 
  editProfile(data: EditProfileRequest)
  {
    return this.http.put(`${environment.apiUrl}/Admin/Edit`,data);
  }
 
  changePassword(data: ChangePasswordRequest): Observable<any> {
    console.log(data);
    
    return this.http.put(`${environment.apiUrl}/Admin/ChangePassword`,data);
  }
 
  changeImage(formData: FormData): Observable<any>{
    return this.http.put(`${environment.apiUrl}/Admin/ChangeImage`,formData);
}

}