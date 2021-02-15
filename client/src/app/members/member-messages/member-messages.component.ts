import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { IMessage } from 'src/app/models/message';
import { MessageService } from 'src/app/services/message.service';

@Component({
  selector: 'app-member-messages',
  templateUrl: './member-messages.component.html',
  styleUrls: ['./member-messages.component.css']
})
export class MemberMessagesComponent implements OnInit {
  @ViewChild('messageForm') messageForm: NgForm;
  @Input() messages: IMessage[];
  @Input() usernameThatIamTalkingTo: string;
  messageContent: string;
  constructor(private messageService: MessageService, private toastr: ToastrService) { }

  ngOnInit(): void {
    // this.loadMessages();
  }

  // loadMessages(): void {
  //   this.messageService.getMessageThread(this.username).subscribe(messages => {
  //     this.messages = messages;
  //   });
  // }

  sendMessage(): void{
    if (this.messageContent === undefined || this.messageContent.length === 0) {
      this.toastr.error('You can not send empty message');
      return;
    }
    this.messageService.sendMessage(this.usernameThatIamTalkingTo, this.messageContent).subscribe(message => {
      this.messages.push(message);
      this.messageForm.reset();
    });
  }
}
