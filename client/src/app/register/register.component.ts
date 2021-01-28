import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IUser } from '../models/user';
import { AccountService } from '../services/account.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  @Input() userFromHomeComponent: IUser[];
  @Output() cancelRegister = new EventEmitter();
   model: any = {};
  constructor(private account: AccountService) { }

  ngOnInit(): void {
  }

  register(): void{
    this.account.register(this.model).subscribe(response => {
     // dont care about response
    });
  }

  cancel(): void {
    this.cancelRegister.emit(false);
  }

}