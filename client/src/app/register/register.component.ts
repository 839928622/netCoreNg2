import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IUser } from '../models/user';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  @Input() userFromHomeComponent: IUser[];
  @Output() cancelRegister = new EventEmitter();
   model: any = {};
  constructor() { }

  ngOnInit(): void {
  }

  register(): void{
    console.log(this.model);
  }

  cancel(): void {
    this.cancelRegister.emit(false);
  }

}
