import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NzCardModule } from 'ng-zorro-antd/card';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzMessageService } from 'ng-zorro-antd/message';

import { PatientMessagesService, PatientMessage } from '../../../services/patient-message/patientmessage';


@Component({
  selector: 'app-patient-messages',
  standalone: true,
  imports: [CommonModule, NzCardModule, NzListModule, NzTagModule, NzDrawerModule, NzSpinModule],
  templateUrl: './patient-messaging-page.html',
  styleUrls: ['./patient-messaging-page.scss']
})
export class PatientMessagesComponent implements OnInit {
  loading = false;
  messages: PatientMessage[] = [];

  drawerOpen = false;
  selected: PatientMessage | null = null;

  constructor(
    private api: PatientMessagesService,
    private msg: NzMessageService
  ) {}

  ngOnInit(): void {
    this.load();
  }

  private extractErr(err: any, fallback: string): string {
    return (
      err?.error?.message ??
      (typeof err?.error === 'string' ? err.error : null) ??
      err?.message ??
      fallback
    );
  }

  load(): void {
    this.loading = true;
    this.api.list().subscribe({
      next: (res) => {
        this.messages = res ?? [];
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.msg.error(this.extractErr(err, 'Failed to load messages'));
      }
    });
  }

  // openMessage(m: PatientMessage): void {
  //   this.selected = m;
  //   this.drawerOpen = true;

  //   if (!m.readFlag) {
  //     this.api.markRead(m.id).subscribe({
  //       next: () => {
  //         this.messages = this.messages.map(x => x.id === m.id ? { ...x, readFlag: true } : x);
  //         this.selected = { ...m, readFlag: true };
  //       },
  //       error: () => {}
  //     });
  //   }
  // }
openMessage(m: PatientMessage): void {
  this.selected = m;         // <-- MUST happen
  this.drawerOpen = true;    // <-- then open

  if (!m.readFlag) {
    this.api.markRead(m.id).subscribe({
      next: () => {
        this.messages = this.messages.map(x => x.id === m.id ? { ...x, readFlag: true } : x);
        this.selected = { ...m, readFlag: true };
      },
      error: () => {}
    });
  }
}
  closeDrawer(): void {
    this.drawerOpen = false;
    this.selected = null;
  }

  preview(body: string): string {
    const s = (body || '').replace(/\s+/g, ' ').trim();
    return s.length > 80 ? s.slice(0, 80) + '…' : s;
  }
}