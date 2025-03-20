export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  userPrincipal: UserPrincipal;
  bearer: string;
  token: string;
  authorities: string[];
}

export interface UserPrincipal {
  bussinesId: number;
  email: string;
  userId: string;
  password: string;
  username: string;
  roles: string[];
}
