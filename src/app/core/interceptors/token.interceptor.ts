import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../auth/services/authentication.service';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(
    readonly authenticationService: AuthenticationService,
    readonly toastr: ToastrService,
    readonly router: Router
  ) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    let intReq = request;

    const token = this.authenticationService.getToken();
    if (token != null) {
      intReq = request.clone({
        headers: request.headers.set('Authorization', 'Bearer ' + token),
        withCredentials: true,
      });
    }

    return next.handle(intReq).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          this.toastr.show(
            'alert',
            'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.'
          );
          this.authenticationService.logout();
          this.router.navigate(['/login']);
        }
        return throwError(() => error);
      })
    );
  }
}
