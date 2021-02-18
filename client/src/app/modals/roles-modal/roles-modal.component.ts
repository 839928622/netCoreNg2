import { Component, EventEmitter, Input, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { IUser } from 'src/app/models/user';

@Component({
  selector: 'app-roles-modal',
  templateUrl: './roles-modal.component.html',
  styleUrls: ['./roles-modal.component.css']
})
export class RolesModalComponent implements OnInit {
  @Input() updateSelectedRoles = new EventEmitter();
  user: IUser;
  roles: any[];
   title: string;
   list: any[] = [];
   closeBtnName: string;
  constructor(public bsModalRef: BsModalRef) { }

  ngOnInit(): void {
  }

  updateRoles(): void {
    this.updateSelectedRoles.emit(this.roles);
    this.bsModalRef.hide();
  }

}
