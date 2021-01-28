import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { IUser } from '../models/user';
import { environment } from './../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class AccountService {
baseUrl = environment.baseUrl;
private currentUserSource = new ReplaySubject<IUser>(1);
currentUser$ = this.currentUserSource.asObservable();

  constructor(private http: HttpClient) {
    console.log(this.currentUserSource);
    console.log(this.currentUser$ );
  }
  login(model: any): Observable<void> {
    return this.http.post<IUser>(this.baseUrl + 'account/login', model).pipe( map( (response: IUser) => {
      if (response) {
        localStorage.setItem('user', JSON.stringify(response));
        this.currentUserSource.next(response);
      }
    }));
  }

  register(model: any): Observable<void> {
return this.http.post(this.baseUrl + 'account/register', model).pipe(
  map((user: IUser) => {
    if (user){
      localStorage.setItem('user', JSON.stringify(user));
      this.currentUserSource.next(user);

    }
  })
);
  }

  setCurrentUser(user: IUser): void {
    this.currentUserSource.next(user);
  }

  logout(): void {
    localStorage.removeItem('user');
    this.currentUserSource.next(null);
  }
}
