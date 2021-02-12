import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IUser } from './models/user';
import { AccountService } from './services/account.service';
import { TimeagoIntl } from 'ngx-timeago';
import {strings as cnStrings} from 'ngx-timeago/language-strings/zh-CN';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'client';
  constructor(private accountService: AccountService, private router: Router, timeago: TimeagoIntl) {
    timeago.strings = cnStrings;
    timeago.changes.next();
  }
  ngOnInit(): void {
    this.setCurrentUser();
  }

  setCurrentUser(): void {
    const user: IUser = JSON.parse(localStorage.getItem('user'));
    this.accountService.setCurrentUser(user);


  }

}
