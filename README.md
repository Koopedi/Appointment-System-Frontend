# Appointment Booking System - Frontend

The Angular frontend for the Appointment Booking System, built with **Angular 20** and **Angular Material**.

---

## Features

* Display list of appointments
* Create new appointments
* Postpone appointments
* Cancel appointments
* Notification/snackbar system

---

## Project Structure

```
frontend/
├── src/app
│   ├── components
│   │   ├── appointment-form
│   │   ├── appointment-list
│   │   ├── dashboard
│   │   ├── footer
│   │   ├── navbar
│   │   └── postpone-form
│   ├── services
│   │   ├── appointment.service.ts
│   │   └── notification.service.ts
│   ├── app.component.ts
│   ├── app.component.html
│   └── app.routes.ts
├── angular.json
├── package.json
└── tsconfig.json
```

---

## Requirements

* Node.js 22+
* NPM 10+
* Angular CLI 20

---

## Run Frontend Locally

```bash
cd frontend
npm install
ng serve
```

* The frontend runs on **[http://localhost:4200](http://localhost:4200)**

---

## Available Pages

* `/dashboard` → Dashboard
* `/appointments` → List of appointments
* `/appointments/new` → Create a new appointment
* `/appointments/:id/postpone` → Postpone an appointment

---

## Angular Services

* `AppointmentService` → Handles HTTP calls to backend API
* `NotificationService` → Shows success, error, and info notifications

---

## Notes

* Uses Angular Material for UI components
* Uses standalone components (Angular 20+)
* No Docker required
* Pure CLI-based setup
