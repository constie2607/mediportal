import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzButtonModule } from 'ng-zorro-antd/button';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, NzGridModule, NzCardModule, NzTableModule, NzTagModule, NzButtonModule],
  templateUrl: './admin-dashboard.html',
  styleUrls: ['./admin-dashboard.scss']
})
export class AdminDashboard {
  stats = {
    totalPatients: 120,
    appointmentsToday: 8,
    pendingApprovals: 3,
    labResultsPending: 2
  };

  pending = [
    { patient: 'John Doe', date: '2026-01-06', time: '10:30', type: 'GP Visit', status: 'PENDING' },
    { patient: 'Mary Jones', date: '2026-01-06', time: '12:00', type: 'Follow-up', status: 'PENDING' },
    { patient: 'Sam Ali', date: '2026-01-07', time: '09:00', type: 'Consult', status: 'PENDING' }
  ];

  approve(row: any): void {
    row.status = 'APPROVED';
  }
}
