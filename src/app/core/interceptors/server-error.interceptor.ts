import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse
} from '@angular/common/http';
import { EMPTY, Observable, catchError, finalize, tap, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { LoaderService } from '../loader/loader.service';
import { ToastrService } from 'ngx-toastr';

interface ResponseBody {
  error?: string;
  errorMessage?: string;
}

@Injectable()
export class ServerErrorsInterceptor implements HttpInterceptor {

  constructor(readonly route: Router, readonly loader: LoaderService, readonly toastr: ToastrService) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    this.loader.showLoader();
    return next.handle(request).pipe(tap(event => {
      if (event instanceof HttpResponse) {
        const body = event.body as ResponseBody;
        if (body && body.error === 'true' && body.errorMessage) {
          throw new Error(body.errorMessage);
        }
      }
    })).pipe(catchError((error: any) => {
      if(error.status) {
        return throwError(() => error);
      }
      return EMPTY;
    }),
      finalize(() => this.loader.hideLoader())
    );
  }
}
