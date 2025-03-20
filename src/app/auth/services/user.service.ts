import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environments.dev';
import { UserPrincipal } from '../../interfaces/login';
import { USER_API_ENDPOINTS } from '../../core/global/constans/api-endpoints';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  uri = environment.url

  constructor(readonly http: HttpClient) { }

  getUserByUsername(username: number): Observable<UserPrincipal> {
    return this.http.get<UserPrincipal>(`${this.uri}/${USER_API_ENDPOINTS.GET_BY_ID}/${username}`);
  }
}