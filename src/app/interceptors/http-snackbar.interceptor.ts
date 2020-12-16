import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AlertType } from '../models/enums/alert-type';
import { MatSnackBarConfig } from '@angular/material/snack-bar';
import { APIResponse, HttpStatusCodes } from '../models/http';
import { GENERAL_ERROR_MESSAGE } from '../constants';
import { AlertService } from 'src/app/services/alert.service';

@Injectable()
export class HttpSnackbarInterceptor implements HttpInterceptor {

  private baseConfig: MatSnackBarConfig = {
    verticalPosition: 'top',
    horizontalPosition: 'center',
    duration: 4000
  };

  constructor(private alertService: AlertService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const method = request.method;
    return next.handle(request)
      .pipe(
        tap((event: HttpEvent<any>) => {
          if (event instanceof HttpResponse) {
            if (this.isError(event.body.status)) {
              this.handleServerError(event.body as APIResponse);
            } else if (this.isSuccess(request.method)) {
              this.handleSuccess(request.method);
            }
          }
        }, (error: HttpErrorResponse) => {
          console.error(error);
          this.handleGeneralError(error);
        })
      );
  }

  parseArrayToString(errors: string[]): string {
    return errors.join('. ');
  }

  handleSuccess(method: string): void {
    let message = 'request was completed';
    if (method === HttpStatusCodes.PUT) {
      message = `Update ${message}`;
    } else if (method === HttpStatusCodes.DELETE) {
      message = `Delete ${message}`;
    } else if (method === HttpStatusCodes.POST) {
      message = `Create ${message}`;
    } else {
      message = `Your ${message}`;
    }
    this.alertService.open(message, AlertType.Success, this.baseConfig);
  }

  handleServerError(body: APIResponse): void {
    let panelClass: AlertType = AlertType.None;
    let message = '';

    if (body.apiErrors.length) {
      panelClass = AlertType.Error;
      message = this.parseArrayToString(body.apiErrors);
    } else if (body.apiWarnings.length) {
      panelClass = AlertType.Warning;
      message = this.parseArrayToString(body.apiErrors);
    } else {
      message = GENERAL_ERROR_MESSAGE;
    }
    this.alertService.open(message, panelClass, { ...this.baseConfig });
    throw Error(message);
  }

  handleGeneralError(error: HttpErrorResponse): void {
    if (error.error.apiErrors) {
      this.handleServerError(error.error as APIResponse);
    } else {
      const message = error.error.message ? error.error.message : GENERAL_ERROR_MESSAGE;
      this.alertService.open(message, AlertType.Error, this.baseConfig);
      throw Error(message);
    }
  }

  isError(status: string): boolean {
    return status === HttpStatusCodes.INTERNAL_SERVER_ERROR || status === HttpStatusCodes.BAD_REQUEST || status === HttpStatusCodes.NOT_FOUND;
  }

  isSuccess(status: string): boolean {
    // TODO: Fix when we want to show success messages
    return status === HttpStatusCodes.POST || status === HttpStatusCodes.PUT || status === HttpStatusCodes.DELETE;
  }
}
