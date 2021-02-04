import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AccountService } from '../services/account.service';
import { take } from 'rxjs/operators';
import { IUser } from '../models/user';

@Injectable()
export class AuthenticationInterceptor implements HttpInterceptor {

  constructor(private account: AccountService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    let currentUser: IUser;
    // tips: we dont need to unsubscribe because once an observable has completed, then we are effectively not subscribe to it anymore.
    this.account.currentUser$.pipe(take(1)).subscribe(user => {
      currentUser = user;
    });
    if (currentUser) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${currentUser.token}`
        }
      });
    }
    return next.handle(request);
  }
}
