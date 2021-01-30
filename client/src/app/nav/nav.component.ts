import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
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
  constructor(private account: AccountService, private router: Router,
              private toastr: ToastrService) { }

  ngOnInit(): void {
   this.currentUser$ = this.account.currentUser$;
  }
 login(): void {
  this.account.login(this.model).subscribe(response => {

  }, error => {
    this.toastr.error('invalid username or password', 'tips');
  });
 }

 logout(): void {
  this.account.logout();
 }

}
