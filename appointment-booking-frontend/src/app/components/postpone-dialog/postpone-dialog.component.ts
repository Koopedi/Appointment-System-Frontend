import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { AppointmentService } from '../../services/appointment.service';
import { NotificationService } from '../../services/notification.service';

export interface PostponeDialogData {
  appointmentId: number;
}

@Component({
  selector: 'app-postpone-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    MatOptionModule,
    MatButtonModule,
    MatDialogModule
  ],
  providers: [
    MatDatepickerModule,
    MatNativeDateModule,
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' }
  ],
  template: `
    <h2 mat-dialog-title>Postpone Appointment</h2>
    <div mat-dialog-content>
      <mat-form-field appearance="fill" class="full-width">
        <mat-label>New Date</mat-label>
        <input matInput [matDatepicker]="picker" [(ngModel)]="newDate" name="newDate" required>
        <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
        <mat-datepicker #picker></mat-datepicker>
      </mat-form-field>

      <mat-form-field appearance="fill" class="full-width">
        <mat-label>New Time</mat-label>
        <mat-select [(ngModel)]="newTime" name="newTime" required [disabled]="!newDate">
          <mat-option *ngFor="let time of availableTimeOptions" [value]="time">{{ time }}</mat-option>
        </mat-select>
      </mat-form-field>
    </div>

    <div mat-dialog-actions align="end">
      <button mat-button (click)="dialogRef.close()">Cancel</button>
      <button mat-raised-button color="primary" (click)="submit()">Postpone</button>
    </div>
  `,
  styles: [`.full-width { width: 100%; margin-bottom: 1rem; }`]
})
export class PostponeDialogComponent {
  newDate!: Date;
  newTime = '';
  availableTimeOptions: string[] = [];

  constructor(
    public dialogRef: MatDialogRef<PostponeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: PostponeDialogData,
    private service: AppointmentService,
    private notify: NotificationService
  ) {
    this.generateTimeOptions();
  }

  private generateTimeOptions() {
    const start = 8, end = 16;
    for (let hour = start; hour <= end; hour++) {
      const hourStr = hour.toString().padStart(2, '0');
      this.availableTimeOptions.push(`${hourStr}:00`, `${hourStr}:30`);
    }
  }

  submit() {
    if (!this.newDate || !this.newTime) {
      this.notify.error('Please select both date and time');
      return;
    }

    const [hours, minutes] = this.newTime.split(':').map(Number);
    const dateTime = new Date(this.newDate);
    dateTime.setHours(hours, minutes);

    const request = {
      appointmentId: this.data.appointmentId,
      newDate: dateTime.toISOString()
    };

  console.log(request)

    this.service.postpone(request).subscribe({
      next: () => {
        this.notify.success('Appointment postponed successfully');
        this.dialogRef.close(true);
      },
      error: () => this.notify.error('Failed to postpone appointment')
    });
  }
}
