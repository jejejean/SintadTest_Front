import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environments.dev';
import { LOGIN_API_ENDPOINTS } from '../../core/global/constans/api-endpoints';
import { LoginRequest, LoginResponse } from '../../interfaces/login';


@Injectable({
  providedIn: 'root'
})
export class LoginService {
  uri = environment.url;
  userKey = 'user_data';

  constructor(readonly http: HttpClient) { }

  login(loginRequest: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.uri}/${LOGIN_API_ENDPOINTS.REQUEST_MAPPING}/${LOGIN_API_ENDPOINTS.LOGIN}`, loginRequest).pipe(
      tap((userPrincipal: LoginResponse) => {
        sessionStorage.setItem(this.userKey, JSON.stringify(userPrincipal));
      }),
      catchError((error) => {
        throw error;
      })
    );
  }

}