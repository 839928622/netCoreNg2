import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { IUser } from '../models/user';
import { AccountService } from '../services/account.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
model: any = {};
currentUser$: Observable<IUser>;
  constructor(private account: AccountService) { }

  ngOnInit(): void {
   this.currentUser$ = this.account.currentUser$;
  }
 login(): void {
  this.account.login(this.model).subscribe(response => {
    console.log(response);
  }, error => {
    console.log(error);
  });
 }

 logout(): void {
  this.account.logout();
 }

}
