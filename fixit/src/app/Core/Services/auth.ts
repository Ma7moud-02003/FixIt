import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { RegisetrModel } from '../../Shared/Models/regiserModel';
import { LoginModel } from '../../Shared/Models/loginModel';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';
import { UserModel } from '../../Shared/Models/UserProfile';

@Injectable({
  providedIn: 'root',
})

export class Auth {
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

  logout() {
    localStorage.removeItem('userToken');
    localStorage.removeItem('user');
    this.userProfileData.set({} as UserModel);
    this.userToken.set('');
    this.router.navigate(['/login']);
  }
}
