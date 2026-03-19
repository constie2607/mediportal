import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

const baseUrl = 'http://localhost:8080';

export type LoginRequest = {
  email: string;
  password: string;
  // dateOfBirth: string;
  remember?: boolean;
};


@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private http: HttpClient) {}
  currentUser: any = null;


  // Login (works for patient/staff/admin depending on backend user role)
  login(payload: LoginRequest): Observable<any> {
    return this.http.post(`${baseUrl}/api/auth/login`, payload, {
      withCredentials: true
    });
  }

  // Keep these for convenience so your components don't break
  loginUser(payload: LoginRequest): Observable<any> {
    return this.login(payload);
  }

  loginAdmin(payload: LoginRequest): Observable<any> {
    // Same endpoint, backend checks role and you redirect accordingly
    return this.login(payload);
  }

  // Who is currently logged in? (cookie must be present)


me(): Observable<any> {
  return this.http.get<any>('http://localhost:8080/api/auth/me', {
    withCredentials: true
  });
}

setCurrentUser(user: any) {
  this.currentUser = user;
}

getCurrentUser() {
  return this.currentUser;
}

  //create staff
  createStaff(payload: any) {
  return this.http.post(`${baseUrl}admin/staff`, payload, { withCredentials: true });
}

activateAccount(payload: { id: string; dateOfBirth:string; password: string }) {
  return this.http.post('http://localhost:8080/api/auth/activate', payload);

}



  // Logout clears the HttpOnly cookie
  logout(): Observable<any> {
    return this.http.post(`${baseUrl}/api/auth/logout`, {}, {
      withCredentials: true
    });
  }
}
