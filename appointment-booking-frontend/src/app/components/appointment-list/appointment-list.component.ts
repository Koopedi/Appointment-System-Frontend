import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AppointmentService } from '../../services/appointment.service';
import { NotificationService } from '../../services/notification.service';
import { PostponeDialogComponent } from '../postpone-dialog/postpone-dialog.component';
import { MatNativeDateModule, MAT_DATE_LOCALE } from '@angular/material/core';
import { RouterModule, Router } from '@angular/router';

interface Appointment {
  id: number;
  customerName: string;
  branchName: string;
  appointmentDate: string;
  status: string;
}

@Component({
  selector: 'app-appointment-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatSnackBarModule,
    MatDialogModule,
    MatNativeDateModule,
    RouterModule
  ],
  templateUrl: './appointment-list.component.html',
  styleUrls: ['./appointment-list.component.scss']
})
export class AppointmentListComponent implements OnInit {
  appointments: Appointment[] = [];
  displayedColumns: string[] = ['id', 'customerName', 'branchName', 'appointmentDate', 'status', 'actions'];

  constructor(
    private service: AppointmentService,
    private notify: NotificationService,
    private dialog: MatDialog,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadAppointments();
  }

  loadAppointments() {
    this.service.getAll().subscribe({
      next: (data) => {
        this.appointments = data;
        console.log('Appointments loaded', this.appointments);
      },
      error: () => this.notify.error('Failed to load appointments')
    });
  }

  cancel(id: number) {
    this.service.cancel(id).subscribe({
      next: () => {
        this.notify.success('Appointment cancelled');
        this.loadAppointments();
      },
      error: () => this.notify.error('Failed to cancel appointment')
    });
  }

  postpone(id: number, branchName: string) {
    const dialogRef = this.dialog.open(PostponeDialogComponent, {
      width: '400px',
      data: { appointmentId: id, branchName }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadAppointments();
      }
    });
  }

  addAppointment() {
  this.router.navigate(['/appointments/new']);
  }
}
