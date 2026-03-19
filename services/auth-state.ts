import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type CurrentUser = {
  id: string;
  email: string;
  role: string; // or your enum string types
};

@Injectable({ providedIn: 'root' })
export class AuthStateService {
  private userSubject = new BehaviorSubject<CurrentUser | null>(null);
  user$ = this.userSubject.asObservable()

  setUser(user: CurrentUser | null): void {
  console.log('AuthState setUser:', user);
  this.userSubject.next(user);
}


  getUser(): CurrentUser | null {
    return this.userSubject.value;
  }

  isLoggedIn(): boolean {
    return !!this.userSubject.value;
  }

  hasRole(...roles: string[]): boolean {
    const u = this.userSubject.value;
    return !!u && roles.includes(u.role);
  }
}
