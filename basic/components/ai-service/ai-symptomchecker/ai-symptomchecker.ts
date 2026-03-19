// ai-symptomchecker.ts (UPDATED + structured symptoms wired in)

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormControl } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

import { NzCardModule } from 'ng-zorro-antd/card';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzMessageService } from 'ng-zorro-antd/message';
import { AiSymptompiService } from '../../../../services/AI/ai-symptomservice';

type UrgencyLevel = 'EMERGENCY' | 'URGENT' | 'ROUTINE' | 'SELF_CARE';
type Sender = 'ai' | 'user';

type Step =
  | 'problem'
  | 'durationText'
  | 'severity'
  | 'durationDays'
  | 'rf_chestPain'
  | 'rf_breathingDifficulty'
  | 'rf_oneSidedWeakness'
  | 'rf_fainted'
  | 'confirm'
  | 'result';

type RedFlagKey = 'chestPain' | 'breathingDifficulty' | 'oneSidedWeakness' | 'fainted';

interface ChatMessage {
  id: string;
  sender: Sender;
  text: string;
  time: Date;
}

@Component({
  selector: 'app-ai-symptomchecker',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    NzCardModule,
    NzButtonModule,
    NzInputModule,
    NzIconModule,
    NzAlertModule
  ],
  templateUrl: './ai-symptomchecker.html',
  styleUrls: ['./ai-symptomchecker.scss']
})
export class AiSymptomChecker {
  loading = false;
  input = new FormControl('', { nonNullable: true });

  step: Step = 'problem';
  messages: ChatMessage[] = [];

  form!: FormGroup;
  result: any | null = null;

  // ✅ NEW: structured symptoms (send to backend)
  symptomOptions = [
    { key: 'cough', label: 'Cough' },
    { key: 'sore_throat', label: 'Sore throat' },
    { key: 'high_fever', label: 'High fever' },
    { key: 'headache', label: 'Headache' },
    { key: 'severe_headache', label: 'Severe headache' },
    { key: 'shortness_of_breath', label: 'Shortness of breath' },
    { key: 'wheeze', label: 'Wheeze' },
    { key: 'chest_pain', label: 'Chest pain' },
    { key: 'palpitations', label: 'Palpitations' },

    { key: 'abdominal_pain', label: 'Stomach pain' },
    { key: 'abdominal_pain_severe', label: 'Severe stomach pain' },
    { key: 'vomiting', label: 'Vomiting' },
    { key: 'diarrhoea', label: 'Diarrhoea' },
    { key: 'blood_in_stool', label: 'Blood in stool' },
    { key: 'vomiting_blood', label: 'Vomiting blood' },

    { key: 'burning_urination', label: 'Burning when peeing' },
    { key: 'urinary_frequency', label: 'Peeing frequently' },
    { key: 'flank_pain', label: 'Flank/side pain' },

    { key: 'back_pain', label: 'Back pain' },
    { key: 'rash', label: 'Rash' },
    { key: 'spreading_redness', label: 'Spreading redness' },

    { key: 'dizziness', label: 'Dizziness' },
    { key: 'fainting', label: 'Fainted / passed out' },
    { key: 'confusion', label: 'Confusion' },
    { key: 'seizure', label: 'Seizure' },
    { key: 'one_sided_weakness', label: 'One-sided weakness' },
    { key: 'pregnancy_bleeding', label: 'Pregnancy + bleeding' },

    { key: 'suicidal_thoughts', label: 'Suicidal thoughts' }
  ];

  selectedSymptoms: string[] = [];

  toggleSymptom(key: string): void {
    if (this.selectedSymptoms.includes(key)) {
      this.selectedSymptoms = this.selectedSymptoms.filter(x => x !== key);
    } else {
      this.selectedSymptoms = [...this.selectedSymptoms, key];
    }
  }

  constructor(
    private fb: FormBuilder,
    private api: AiSymptompiService,
    private msg: NzMessageService,
    private router: Router
  ) {
    this.form = this.fb.group({
      problem: ['', [Validators.required, Validators.maxLength(500)]],
      duration: ['', [Validators.required, Validators.maxLength(500)]],
      severity: [5, [Validators.min(1), Validators.max(10)]],
      durationDays: [0, [Validators.min(0), Validators.max(365)]],
      redFlags: this.fb.group({
        chestPain: [false],
        breathingDifficulty: [false],
        oneSidedWeakness: [false],
        fainted: [false]
      })
    });

    this.boot();
  }

  private boot(): void {
    this.say("Hi, I’m your AI symptom checker. What’s your main symptom or problem today?");
    this.step = 'problem';
  }

  private say(text: string): void {
    this.messages.push({
      id: crypto.randomUUID(),
      sender: 'ai',
      text,
      time: new Date()
    });
    this.scrollToBottomSoon();
  }

  private userSays(text: string): void {
    this.messages.push({
      id: crypto.randomUUID(),
      sender: 'user',
      text,
      time: new Date()
    });
    this.scrollToBottomSoon();
  }

  private scrollToBottomSoon(): void {
    setTimeout(() => {
      const el = document.getElementById('chat-scroll');
      if (el) el.scrollTop = el.scrollHeight;
    }, 0);
  }

  parseJsonArray(value: any): string[] {
    if (!value) return [];
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  get urgency(): UrgencyLevel | null {
    return this.result?.aiUrgencyLevel ?? null;
  }

  sendText(): void {
    const text = this.input.value.trim();
    if (!text) return;

    if (this.step === 'problem') {
      this.userSays(text);
      this.form.patchValue({ problem: text });
      this.input.setValue('');

      // optional: gently prompt symptom selection exists (even if UI handles it)
      this.say('Got it. (Optional) Tap any related symptoms, then tell me how long it’s been going on.');
      this.step = 'durationText';
      return;
    }

    if (this.step === 'durationText') {
      this.userSays(text);
      this.form.patchValue({ duration: text });
      this.input.setValue('');

      this.say('On a scale of 1–10, how severe is it right now?');
      this.step = 'severity';
      return;
    }

    if (this.step === 'durationDays') {
      const n = Number(text);
      if (Number.isNaN(n) || n < 0 || n > 365) {
        this.msg.warning('Please enter a number of days between 0 and 365.');
        return;
      }

      this.userSays(text);
      this.form.patchValue({ durationDays: n });
      this.input.setValue('');

      this.say('Quick safety check: do you have chest pain?');
      this.step = 'rf_chestPain';
      return;
    }
  }

  pickSeverity(n: number): void {
    if (this.step !== 'severity') return;

    this.userSays(String(n));
    this.form.patchValue({ severity: n });

    this.say('About how many days has it been happening? (Just a number like 0, 3, 10)');
    this.step = 'durationDays';
  }

  answerYesNo(flagKey: RedFlagKey, value: boolean): void {
    this.userSays(value ? 'Yes' : 'No');

    const redFlagsGroup = this.form.get('redFlags');
    redFlagsGroup?.get(flagKey)?.setValue(value);

    if (this.step === 'rf_chestPain') {
      this.say('Any breathing difficulty right now?');
      this.step = 'rf_breathingDifficulty';
      return;
    }

    if (this.step === 'rf_breathingDifficulty') {
      this.say("Any one-sided weakness (face droop, weak arm/leg) or trouble speaking?");
      this.step = 'rf_oneSidedWeakness';
      return;
    }

    if (this.step === 'rf_oneSidedWeakness') {
      this.say('Have you fainted / passed out?');
      this.step = 'rf_fainted';
      return;
    }

    if (this.step === 'rf_fainted') {
      const v = this.form.value;
      const sym = this.selectedSymptoms.length ? this.selectedSymptoms.join(', ') : 'None selected';

      this.say(
        `Thanks. Here’s what I’ve got:\n` +
        `• Problem: ${v.problem}\n` +
        `• Duration: ${v.duration}\n` +
        `• Severity: ${v.severity}/10\n` +
        `• Duration (days): ${v.durationDays}\n` +
        `• Symptoms selected: ${sym}\n\n` +
        `Ready to check?`
      );
      this.step = 'confirm';
    }
  }

  runCheck(): void {
    if (this.step !== 'confirm') return;

    if (this.form.invalid) {
      this.msg.error('Missing required info. Please complete the questions.');
      return;
    }

    this.loading = true;
    this.say('Analysing your symptoms…');

    // ✅ NEW: include structured symptoms in payload
    const payload = {
      ...this.form.value,
      symptoms: this.selectedSymptoms
    };

    this.api.createTriageRequest(payload).subscribe({
      next: (res: any) => {
        this.loading = false;
        this.result = res;
        this.step = 'result';

        const urgency = res?.aiUrgencyLevel as UrgencyLevel | undefined;
        if (urgency === 'EMERGENCY') this.say('This sounds potentially serious. Please call 999 or go to A&E now.');
        else if (urgency === 'URGENT') this.say('This may need urgent GP advice today. I recommend booking an urgent consultation.');
        else if (urgency === 'ROUTINE') this.say('A routine GP appointment may help. You can book a consultation.');
        else this.say('This looks suitable for self-care right now. I’ve included advice and when to seek help.');
      },
      error: (err: any) => {
        this.loading = false;
        const message = err?.error?.message || err?.error || 'Failed to run symptom check';
        this.msg.error(message);
      }
    });
  }

  bookAppointment(): void {
    const priority = this.urgency || 'ROUTINE';
    this.router.navigate(['/patient/book-appointment'], {
      queryParams: { priority }
    });
  }

  reset(): void {
    this.messages = [];
    this.result = null;
    this.loading = false;

    this.form.reset({
      problem: '',
      duration: '',
      severity: 5,
      durationDays: 0,
      redFlags: {
        chestPain: false,
        breathingDifficulty: false,
        oneSidedWeakness: false,
        fainted: false
      }
    });

    // ✅ NEW: clear symptoms + input
    this.selectedSymptoms = [];
    this.input.setValue('');

    this.boot();
  }
}