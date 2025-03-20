import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { LoginService } from './login.service';
import { LoginRequest, LoginResponse } from '../../interfaces/login';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  tokenKey = 'token';
  AUTHORITIES_KEY = 'authorities';
  
  private roles: Array<string> = [];

  constructor(
    readonly router: Router,
    readonly loginService: LoginService,
  ) { }

  public login(loginRequest: LoginRequest): Observable<LoginResponse> {
    return this.loginService.login(loginRequest).pipe(
      tap(({ token, bearer }) => {
        sessionStorage.setItem(this.tokenKey, token);
        sessionStorage.setItem('bearer', bearer);
        this.router.navigate(['/intranet']);
      })
    );
  }

  logout(): void {
    sessionStorage.clear();
    this.router.navigate(['/login']);
  }

  public isLoggedIn(): boolean {
    let token = sessionStorage.getItem(this.tokenKey);
    return token != null && token.length > 0;
  }

  public getToken(): string | null {
    return this.isLoggedIn() ? sessionStorage.getItem(this.tokenKey) : null;
  }

  public getAuthorities(): string[] {
    this.roles = [];
    const sessionData = sessionStorage.getItem('user_data');
    if (sessionData) {
      const storedObject = JSON.parse(sessionData);
      const authorities = storedObject.authorities || [];
      authorities.forEach((authObject: { authority: string }) => {
        this.roles.push(authObject.authority);
      });
    }
    return this.roles;
  }
}