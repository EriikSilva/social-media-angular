import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthData } from './auth-data.model';
import { Subject } from 'rxjs';


import { environment } from 'src/environments/environment';

const BACKEND_URL = environment.apiUrl + '/user/';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isAuthenticated = false;
  private token: string;
  private tokenTimer: ReturnType<typeof setTimeout>;
  private authStatusListener = new Subject<boolean>();
  private userId: string;

  constructor(private http: HttpClient, private router: Router) {}

  getToken() {
    return this.token;
  }

  getIsAuth() {
    console.log('AuthGuard No service:',this.isAuthenticated)
    // this.isAuthenticated = true;
    return this.isAuthenticated;
  }


  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  getUserId() {
    return this.userId;
  }

  createUser(email: string, password: string) {
    const AuthData: AuthData = { email: email, password: password };
    return this.http
      .post(BACKEND_URL  + '/signup', AuthData)
      .subscribe({
        next: () => this.router.navigate(['/']),
        error: ()=> this.authStatusListener.next(false)
      })


      
      // .subscribe((response) => {
      //   console.log('@Oq temos no response do postService:', response);
      // }, error => {
      //   console.log(error)
      // });
  }

  login(email: string, password: string) {
    const AuthData: AuthData = { email: email, password: password };
    this.http
      .post<{ token: string; expiresIn: number; userId: string }>(
        BACKEND_URL + '/login',
        AuthData
      )
      .subscribe((response) => {
        // console.log(response)
        const token = response.token;
        this.token = token;
        //Usuario esta logado (se tiver um token valido)
        if (token) {
          const expiressIn = response.expiresIn;
          this.isAuthenticated = true;
          this.setAuthTimer(expiressIn);
          this.userId = response.userId;
          this.authStatusListener.next(true);

          const now = new Date();
          const expirationDate = new Date(now.getTime() + expiressIn * 1000);
          console.log('@Expiration Date', expirationDate);
          this.saveAuthData(token, expirationDate, this.userId);

          this.router.navigate(['/']);
        }
      }, error => {
        this.authStatusListener.next(false)
        console.log(error)
      });
  }
  //SERVER PRA QUANDO O USUARIO DAR RELOAD NA PAGINA ELE N DESLOGAR
  autoAuthUser() {
    const authInformation = this.getAuthData();
    if (!authInformation) {
      return;
    }
    const now = new Date();
    const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
    if (expiresIn > 0) {
      this.isAuthenticated = true;
      this.token = authInformation.token;
      this.userId = authInformation.userId;
      this.setAuthTimer(expiresIn / 1000);
      this.authStatusListener.next(true);
    }
  }

  private setAuthTimer(duration: number) {
    console.log('qual é o timer -> ', duration);
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
    console.log('@@expira em', this.tokenTimer + ' min');
  }

  logout() {
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    this.userId = null;
    this.clearAuthData();
    this.router.navigate(['/auth/login']);
    clearTimeout(this.tokenTimer);
  }


  private saveAuthData(token: string, expirationDate: Date, userId: string) {
    // console.log(localStorage);
    localStorage.setItem('token', token);
    localStorage.setItem('expirationDate', expirationDate.toISOString());
    localStorage.setItem('userId', userId);
  }

  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expirationDate');
    localStorage.removeItem('userId');
  }

  private getAuthData() {
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiration');
    const userId = localStorage.getItem('userId');

    if (!token || !expirationDate) {
      // console.log("Man tem Token", token);
      return;
    }

    return {
      token: token,
      expirationDate: new Date(expirationDate),
      userId: userId,
    };
  }
}
