import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { inject, Injectable, OnInit, signal } from '@angular/core';
import { RegisetrModel } from '../../Shared/Models/regiserModel';
import { LoginModel } from '../../Shared/Models/loginModel';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';
import { UserModel } from '../../Shared/Models/UserProfile';

@Injectable({
  providedIn: 'root',
})

export class Auth implements OnInit{
  ngOnInit(): void {
    console.log(this.getUser());
    
  }
  private router = inject(Router);

  constructor() {
    this.getUserToken();
  }


  userToken = signal<string>('');
  userProfileData = signal<UserModel>({} as UserModel);
  private http = inject(HttpClient);

  getUserToken(): string {
    if (localStorage.getItem('userToken') != null)
      this.userToken.set(localStorage.getItem('userToken') || '');
    return this.userToken();
  }

  getUserId()
  {
        const userString = JSON.parse(localStorage.getItem('user')!);
    if (userString != null)
    return userString.userId;
  }


  getUser() {
    const userString = localStorage.getItem('user');
    if (userString != null)
      this.userProfileData.set(JSON.parse(userString) as UserModel);
    return this.userProfileData();
  }

  getRole():string|undefined
  {
    return this.getUser().role;
  }

 
  register(registerForm: RegisetrModel) {
    return this.http.post(`${environment.apiUrl}/Account/Register`, registerForm);
  }

  login(loginForm: LoginModel) {
    return this.http.post(`${environment.apiUrl}/Account/Login`, loginForm);
  }
getUserIdFromToken() {
  const token = this.getUserToken()
    ?.replace('Bearer ', '')
    ?.replace(/"/g, '');

  if (!token) return '';

  const payload = JSON.parse(atob(token.split('.')[1]));

  const claims = Object.keys(payload);

  const nameIdKey = claims.find(k =>
    k.includes('nameidentifier')
  );
 console.log(payload[nameIdKey!]);
 
  return payload[nameIdKey!];
}
  logout() {
    localStorage.removeItem('userToken');
    localStorage.removeItem('user');
    this.userProfileData.set({} as UserModel);
    this.userToken.set('');
    this.router.navigate(['/login']);
  }
  getNavDetails(){
     const{fullName,imgUrl,role} =this.getUser();
     return {fullName,imgUrl,role
     }
  }

  verifyAccount(token: string, userId: string) {
  // 1. وضع التوكن في الهيدر (تأكد من الاسم اللي الباك إند مستنيه، سواء 'token' أو 'Authorization')
  const headers = new HttpHeaders()
    .set('token', token); 

  // 2. وضع الـ userId في الـ params لو مستنيه هناك
  const params = new HttpParams()
    .set('userId', userId);

  return this.http.get(`${environment.apiUrl}/Account/ConfirmEmail`, { headers, params });
}

// reset forgetten password
sendEmail(email:string){
  console.log(email);
  
return this.http.post(`${environment.apiUrl}/Account/ForgotPassword`, {email});
}

}
