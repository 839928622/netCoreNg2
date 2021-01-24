import { Component, OnInit } from '@angular/core';
import { AccountService } from '../services/account.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
model: any = {};
  constructor(private account: AccountService) { }

  ngOnInit(): void {
  }
 login(): void {
  this.account.login(this.model).subscribe(response => {
    console.log(response);
  }, error => {
    console.log(error);
  });
 }

 logout(): void {
   console.log('logout');
 }
}
