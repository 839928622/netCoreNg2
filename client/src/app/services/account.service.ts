import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Observable, ReplaySubject } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { IUser } from '../models/user';
import { environment } from './../../environments/environment';
import { PresenceService } from './presence.service';
@Injectable({
  providedIn: 'root'
})
export class AccountService {
baseUrl = environment.baseUrl;
private currentUserSource = new ReplaySubject<IUser>(1);
currentUser$ = this.currentUserSource.asObservable();

  constructor(private http: HttpClient, private router: Router,
              private toastr: ToastrService, private presenceService: PresenceService,
              private translate: TranslateService
              ) {
    console.log(this.currentUserSource);
    console.log(this.currentUser$ );
  }
  login(model: any): Observable<void> {
    return this.http.post<IUser>(this.baseUrl + 'account/login', model).pipe( map( (response: IUser) => {
      if (response) {
        // localStorage.setItem('user', JSON.stringify(response));
        // this.currentUserSource.next(response);
        this.setCurrentUser(response);
        this.translate.stream('account-service.welcome').pipe(take(1)).subscribe( (welcome: string) => {
          this.toastr.success(welcome + ' ' + response.userName, '');
        });
        this.presenceService.createHubConnection(response);
        this.router.navigateByUrl('/members');
      }

    }));
  }

  register(model: any): Observable<void> {
return this.http.post(this.baseUrl + 'account/register', model).pipe(
  map((user: IUser) => {
    if (user){

      this.setCurrentUser(user);
      this.presenceService.createHubConnection(user);
    }
  })
);
  }

  setCurrentUser(user: IUser): void {
    const roles = this.getDecodedToken(user.token).role;
    console.log(roles);
    Array.isArray(roles) ? user.roles = roles : user.roles = [roles];
    localStorage.setItem('user', JSON.stringify(user));
    console.log(user);
    this.currentUserSource.next(user);
  }

  logout(): void {
    localStorage.removeItem('user');
    this.currentUserSource.next(null);
    this.presenceService.stopHubConnection();
    this.router.navigateByUrl('/');
  }

  getDecodedToken(token: string): any
  {
    return JSON.parse(atob(token.split('.')[1]));
  }

 }
