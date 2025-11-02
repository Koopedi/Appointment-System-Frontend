import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { AppointmentService, AppointmentRequest } from '../../services/appointment.service';
import { NotificationService } from '../../services/notification.service';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-appointment-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    RouterModule
  ],
  templateUrl: './appointment-form.component.html',
  styleUrls: ['./appointment-form.component.scss']
})
export class AppointmentFormComponent {

 customerName = '';
  branchName = '';
  appointmentDate!: Date;
  appointmentTime = '';
  contactNumber = '';
  timeOptions: string[] = [];
  availableTimeOptions: string[] = [];
  isLoadingTimes = false;


  branches: string[] = [
    'Johannesburg', 'Cape Town', 'Durban', 'Pretoria', 'Port Elizabeth',
    'Bloemfontein', 'East London', 'Kimberley', 'Polokwane', 'Nelspruit',
    'Pietermaritzburg', 'Vereeniging', 'Welkom', 'Mthatha', 'Upington'
  ];

  constructor(
    private service: AppointmentService,
    private notify: NotificationService,
    private router: Router
  ) {
    this.generateTimeOptions();
  }

  private generateTimeOptions() {
    const start = 8;
    const end = 16;
    for (let hour = start; hour <= end; hour++) {
      const hourStr = hour.toString().padStart(2, '0');
      this.timeOptions.push(`${hourStr}:00`);
      this.timeOptions.push(`${hourStr}:30`);
    }
    this.availableTimeOptions = [...this.timeOptions];
  }

  onDateOrBranchChange() {
    if (!this.appointmentDate || !this.branchName) {
      this.availableTimeOptions = [...this.timeOptions];
      this.appointmentTime = '';
      return;
    }

    this.isLoadingTimes = true;
    const dateStr = this.appointmentDate.toISOString().split('T')[0];

    this.service.getBookedTimes(dateStr, this.branchName).subscribe(
      (bookedTimes: string[]) => {
        this.availableTimeOptions = this.timeOptions.filter(time => !bookedTimes.includes(time));
        this.appointmentTime = '';
        this.isLoadingTimes = false;
      },
      () => {
        this.notify.error('Failed to load booked times');
        this.availableTimeOptions = [...this.timeOptions];
        this.isLoadingTimes = false;
      }
    );
  }

  submit() {
    if (!this.customerName || !this.branchName || !this.appointmentDate || !this.appointmentTime || !this.contactNumber) {
      this.notify.error('Please fill in all required fields');
      return;
    }

    const [hours, minutes] = this.appointmentTime.split(':').map(Number);
    const dateTime = new Date(this.appointmentDate);
    dateTime.setHours(hours, minutes);

    const request: AppointmentRequest = {
      customerName: this.customerName,
      branchName: this.branchName,
      appointmentDate: dateTime.toISOString(),
      contactNumber: this.contactNumber
    };

    this.service.create(request).subscribe(() => {
      this.notify.success('Appointment created');
      this.router.navigate(['/appointments']);
    });
  }

  cancelAppointment() {
   this.router.navigate(['/appointments']);
  }

}
