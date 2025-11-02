import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  constructor(private snackBar: MatSnackBar) {}

  success(message: string, duration: number = 2000) {
    this.snackBar.open(message, 'Close', { duration, panelClass: ['snackbar-success'] });
  }

  error(message: string, duration: number = 3000) {
    this.snackBar.open(message, 'Close', { duration, panelClass: ['snackbar-error'] });
  }

  info(message: string, duration: number = 2000) {
    this.snackBar.open(message, 'Close', { duration, panelClass: ['snackbar-info'] });
  }
}
