import {
    HttpEvent,
    HttpHandler,
    HttpInterceptor,
    HttpRequest
  } from '@angular/common/http';
  import { Observable, throwError } from 'rxjs';
  import { catchError } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';
import { isHttpAuthErrorResponse } from '../auth/utils/auth.utils';
import { Injectable } from '@angular/core';
import { AlertService } from '../services/alert.service';
import { AlertType } from '../models/enums/alert-type';
import { GENERAL_AUTH_ERROR_MESSAGE } from 'src/app/constants';
import { environment } from 'src/environments/environment';

@Injectable()
  export class AppAuthInterceptor implements HttpInterceptor {
    constructor(
      private authService: AuthService,
      private alertService: AlertService
    ) {}
  
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
      if (environment.production) {
        this.authService.keepAlive();
        const requestCopy = request.clone({
          headers: request.headers.set('X-Navify-Tenant', localStorage.getItem('GCT_X_Navify_Tenant')),
          withCredentials: true,
        });
        const handleError = (error) => {
          if (isHttpAuthErrorResponse(error)) {
            this.alertService.open(error.message ? error.message : GENERAL_AUTH_ERROR_MESSAGE, AlertType.Error);
          }
    
          return throwError(error);
        };
        return next.handle(requestCopy).pipe(catchError(handleError));
      }
      return next.handle(request);
    }
  }
  