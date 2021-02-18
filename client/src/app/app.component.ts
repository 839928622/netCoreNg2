import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TimeagoIntl } from 'ngx-timeago';
import { strings as cnStrings } from 'ngx-timeago/language-strings/zh-CN';
import { IUser } from './models/user';
import { AccountService } from './services/account.service';
import { PresenceService } from './services/presence.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'client';
  constructor(private accountService: AccountService, private router: Router, timeago: TimeagoIntl,
              private presenceService: PresenceService) {
    timeago.strings = cnStrings;
    timeago.changes.next();
  }
  ngOnInit(): void {
    this.setCurrentUser();
  }

  setCurrentUser(): void {
    const user: IUser = JSON.parse(localStorage.getItem('user'));
    if (user) {
      this.accountService.setCurrentUser(user);
      this.presenceService.createHubConnection(user);
    }


  }

}
