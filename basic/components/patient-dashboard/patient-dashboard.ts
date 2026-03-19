import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzTableModule } from 'ng-zorro-antd/table';
import { FormBuilder } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { Triage } from '../../../services/triage/triage';

@Component({
  selector: 'app-patient-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    NzGridModule,
    NzCardModule,
    NzTableModule,
    NzTagModule,
    RouterModule],
  templateUrl: './patient-dashboard.html',
  styleUrls: ['./patient-dashboard.scss']
})
export class PatientDashboardComponent {
  latestRequest: any | null = null;

   constructor(
    private fb: FormBuilder, 
    private msg: NzMessageService,
    private router: Router,
    private triageService:Triage
  ) {}

ngOnInit() {
  this.loadLatestRequest();
}
latestRequests: any[] = []; 

// loadLatestRequest() {
//   this.triageService.getMyRequests().subscribe(list => {
//     this.latestRequests = list?? [];
//   });
// }
loadLatestRequest() {
  this.triageService.getMyRequests().subscribe({
    next: (list) => {
      console.log('TRIAGE LIST FROM API:', list);
      this.latestRequest = list?.[0] ?? null;
      console.log('LATEST REQUEST:', this.latestRequest);
    },
    error: err => {
      console.error('FAILED TO LOAD TRIAGE REQUESTS', err);
    }
  });
}


  quick = {
    nextAppointment: '2026-01-06 10:30',
    unreadMessages: 0,
    newLabResults: 1,
    activePrescriptions: 2
  };
 


  upcoming = [
    { date: '2026-01-06', time: '10:30', type: 'GP Visit' },
    { date: '2026-01-18', time: '14:00', type: 'Follow-up' }
  ];
}
