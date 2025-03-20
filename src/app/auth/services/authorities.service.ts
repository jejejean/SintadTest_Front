import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthoritiesService {
  private roles: string = '';
  private username: string = '';

  constructor() {
    this.loadUserData();
  }

  private loadUserData() {
    const sessionData = sessionStorage.getItem('user_data');
    if (sessionData) {
      const storedObject = JSON.parse(sessionData);
      const { userPrincipal, authorities } = storedObject;
      this.username = userPrincipal.username;
      this.roles = authorities.map((authority: any) => authority.authority);
    }
  }

  getRoles(): string {
    return this.roles[0];
  }

  getUsername(): string {
    return this.username;
  }

  hasRole(role: string): boolean {
    return this.roles.includes(role);
  }
}
