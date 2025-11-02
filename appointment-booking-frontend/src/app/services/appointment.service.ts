import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Appointment {
  id: number;
  customerName: string;
  branchName: string;
  appointmentDate: string;
  contactNumber: string;
  status: string;
}

export interface AppointmentRequest {
  customerName: string;
  branchName: string;
  appointmentDate: string;
  contactNumber: string;
}

export interface PostponeRequest {
  appointmentId: number;
  newDate: string;
}

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {
  private apiUrl = 'http://localhost:8080/api/appointments';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(this.apiUrl);
  }

  create(request: AppointmentRequest): Observable<Appointment> {
    return this.http.post<Appointment>(this.apiUrl, request);
  }

  cancel(id: number): Observable<Appointment> {
    return this.http.put<Appointment>(`${this.apiUrl}/${id}/cancel`, {});
  }

  postpone(request: any): Observable<Appointment> {
    return this.http.put<Appointment>(`${this.apiUrl}/postpone`, request);
  }



getBookedTimes(date: string, branchName: string): Observable<string[]> {
  return this.http.get<string[]>(`/api/appointments/booked?date=${date}&branch=${branchName}`);
}

getAvailableTimes(date: string): Observable<string[]> {
  return this.http.get<string[]>(`${this.apiUrl}/available-times?date=${date}`);
}

postponeAppointment(id: number, date: Date, time: string): Observable<any> {
  const body = { newDate: date, newTime: time };
  console.log(body)
  return this.http.put(`${this.apiUrl}/appointments/${id}/postpone`, body);
}

}
