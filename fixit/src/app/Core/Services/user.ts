import { HttpClient, HttpParams } from '@angular/common/http';
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
 getWorkers(
  page: number,
  pageSize: number,
  address?: string,
  search?: string,
  IsAvilable?: boolean,
  minRate?:number,
  catogs?:any

): Observable<any> {

  let params = new HttpParams()
    .set('pageNum', page)
    .set('pageSize', pageSize);


  if (search) {
    params = params.set('search', search);
  }

  if (address) {
    params = params.set('address', address);
  }
  if (IsAvilable) {
    params = params.set('IsAvilable', IsAvilable.toString());
  }
   if (minRate) {
    params = params.set('minRate', minRate.toString());
  }
 if (catogs) {
  // 1️⃣ أولاً: نضمن أن البيانات تحولت لمصفوفة أرقام نظيفة حتى لو كانت مبعوثة كـ String مثل '1,34'
  const categsArray: number[] = Array.isArray(catogs) 
    ? catogs.map(id => Number(id)) 
    : catogs.split(',').map((id: string) => Number(id.trim()));

  console.log('المصفوفة المرسلة للداتابيز:', categsArray); // ستظهر لك في الكونسول: [1, 34]

  // 2️⃣ ثانياً: نقوم بعمل Loop ونضيف كل عنصر باستخدام append وليس set
  categsArray.forEach(id => {
    if (!isNaN(id)) { // للتأكد من أن القيمة رقم صحيح وليس NaN
      params = params.append('categoryIds', id.toString());
    }
  });
}
  return this.http.get(
    `${environment.apiUrl}/Worker/AllWorkers`,
    { params }
  );
}

getCategorise(){
    return this.http.get(`${environment.apiUrl}/Category/Allcategories`);

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
