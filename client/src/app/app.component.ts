import { Component, OnInit } from '@angular/core';
import { IMember } from './models/member';
import { AccountService } from './services/account.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'client';
  constructor(private accountService: AccountService) {}
  ngOnInit(): void {
    this.setCurrentUser();
  }

  setCurrentUser(): void {
    const user: IMember = JSON.parse(localStorage.getItem('user'));
    this.accountService.setCurrentUser(user);
  }

}
