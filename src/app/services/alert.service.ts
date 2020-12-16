import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { AlertComponent } from '../components/alert/alert.component';

@Injectable()
export class AlertService {

  constructor(public snackbar: MatSnackBar) { }

  open(message: string, panelClass: string, config: MatSnackBarConfig) {
    this.snackbar.openFromComponent(AlertComponent, { ...config, panelClass, data: { message, type: panelClass } });
  }

}