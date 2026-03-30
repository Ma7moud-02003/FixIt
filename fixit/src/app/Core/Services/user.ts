import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserEditeModel, WorkerEditModel, WorkerModel } from '../../Shared/Models/UserProfile';
import { environment } from '../../../environments/environment';
import { NewPasswordModel } from '../../Shared/Models/changingPass';
import { UserRole } from '../../Shared/enums/role';

@Injectable({
  providedIn: 'root',
})
export class User {
  private http = inject(HttpClient);


  // worker section ---------------------------------

  // getting user profile data (worker)
  getWorkerData(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/Worker/Profile`);
  }

  // getting all workers 
  getWorkers(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/Worker/AllWorkers`)
  }

  // editing worker profile data  under processing
  editWorkerProfile(newProfileData: any) {
    return this.http.put(`${environment.apiUrl}/Worker/Edite`, newProfileData);
  }

  viewWorkerProfile(workerId: string): Observable<any> {
    return this.http.get(`${environment.apiUrl}/Worker/WorkerProfile/${workerId}`);
  }


  // client section ------------------------------

  // editing user profile data as a client 
  editUserProfile(newProfileData: UserEditeModel) {
    return this.http.put(`${environment.apiUrl}/Client/Edit`, newProfileData);
  }

  // getting user profile data (client)
  getUserData(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/Client/Profile`);
  }

  // sharing -------------------
  // deleting user account as client 
  deleteUserAccount() {
    return this.http.delete(`${environment.apiUrl}/Client/Delete`)
  }

  // chanfging password for worker 
  changePassword(newPassForm: NewPasswordModel) {
    return this.http.put(`${environment.apiUrl}/Client/ChangePassword`, newPassForm);
  }

  editeUserImageProfile(file: FormData, role: string) {
    if (role == UserRole.Clien_Role)
      return this.http.put(`${environment.apiUrl}/Client/ChangeImage`, file);
    else if (role == UserRole.Worker_Role)
      return this.http.put(`${environment.apiUrl}/Worker/ChangeImage`, file);
    else
      return null;
  }

}
