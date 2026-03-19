import { Routes } from '@angular/router';
import { LoginComponent } from './basic/login/login';
import { AdminDashboard } from './admin/components/admin-dashboard/admin-dashboard';
import { AdminLayoutComponent } from './admin/layouts/admin-layout/admin-layout';
import { PatientLayoutComponent } from './basic/layouts/patient-layout/patient-layout';
import { PatientDashboardComponent } from './basic/components/patient-dashboard/patient-dashboard';
import { EmployeesComponent } from './admin/components/admin-employee/admin-employee';
import { CreateStaff } from './admin/components/create-staff/create-staff';
import { RegPatient } from './admin/components/admin-patient/reg-patient/reg-patient';
import { PatientMessagesComponent } from './basic/components/patient-messaging-page/patient-messaging-page';

export const routes: Routes = [
  // Default → user login
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  // User login
  { path: 'login', component: LoginComponent },

  //register
  {
    path: 'register',
    loadComponent: () =>
      import('././shared/register/register')
        .then(m => m.RegisterComponent)
  },

  // Admin login
  {
    path: 'admin/admin-login',
    loadComponent: () =>
      import('./admin/admin-login/admin-login')
        .then(m => m.AdminLoginComponent)
  },
   
  // Admin area (sidebar lives here)
  {
    path: 'admin',
    loadComponent: () =>
      import('./admin/layouts/admin-layout/admin-layout')
      .then(m => m.AdminLayoutComponent),
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./admin/components/admin-dashboard/admin-dashboard')
          .then(m => m.AdminDashboard)
      },
      {
  path: 'patients/register',
  loadComponent: () =>
    import('./admin/components/admin-patient/reg-patient/reg-patient')
      .then(m => m.RegPatient)
},
{
  path: 'patients/view',
  loadComponent: () =>
    import('./admin/components/admin-patient/view-patients/view-patients')
      .then(m => m.ViewPatients)
},
{
  path: 'profile',
  loadComponent: () =>
    import('./admin/components/admin-profile/admin-profile').then(m => m.AdminProfile)
},
 {
        path: 'triage',
        loadComponent: () =>
          import('./admin/components/admin-triage/admin-triage/admin-triage')
          .then(m => m.AdminTriage)
      },
       {
        path: ':userId/medical-history',
        loadComponent: () =>
          import('./admin/components/medical-history/medical-history')
          .then(m => m.MedicalHistoryComponent)
      },
      {
  path: 'appointments',
  loadComponent: () =>
    import('./admin/components/admin-appointments/admin-appointments/admin-appointments').then(m => m.AdminAppointments)
},
 {
  path: 'staff-schedule',
  loadComponent: () =>
    import('./admin/components/admin-staff-schedule/admin-staff-schedule')
      .then(m => m.AdminStaffSchedule)
},


          {
  path: 'staff',
  loadComponent: () =>
    import('./admin/components/admin-employee/admin-employee')
   .then(m => m.EmployeesComponent),
        children: [
          {
            path: 'registerStaff',
            loadComponent: () =>
              import('./admin/components/create-staff/create-staff')
            .then(m => m.CreateStaff)
          }
        ]
},
    ]
  },

  // Patient area (sidebar lives here)
  {
    
    path: 'patient',
    loadComponent: () =>
      import('./basic/layouts/patient-layout/patient-layout')
        .then(m => m.PatientLayoutComponent),
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./basic/components/patient-dashboard/patient-dashboard').then(m => m.PatientDashboardComponent)
      },
       {
     path: 'messages',
      loadComponent: () =>
    import('./basic/components/patient-messaging-page/patient-messaging-page')
      .then(m => m.PatientMessagesComponent)
        },
      {
     path: 'book-appointment',
      loadComponent: () =>
    import('./basic/components/patient/book-appointment/book-appointment')
      .then(m => m.BookAppointment)
        },
        {
         path: 'medication',
      loadComponent: () =>
    import('./basic/components/patient-medication/patient-medication')
      .then(m => m.PatientMedication)
        },
         {
  path: 'profile',
  loadComponent: () =>
    import('./basic/components/patient-profile/patient-profile').then(m => m.PatientProfile)
},
        {
         path: 'medicalHistory',
      loadComponent: () =>
    import('./basic/components/patient-medical-history/patient-medical-history')
      .then(m => m.PatientMedicalHistory)
        },
        {
  path: 'ai-symptomchecker',
  loadComponent: () =>
    import('./basic/components/ai-service/ai-symptomchecker/ai-symptomchecker')
      .then(m => m.AiSymptomChecker)
}
    ]    
  },



  // Fallback
  { path: '**', redirectTo: 'login' }
];
