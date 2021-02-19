import { Component, Input, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { IMember } from 'src/app/models/member';
import { MembersService } from 'src/app/services/members.service';
import { PresenceService } from 'src/app/services/presence.service';

@Component({
  selector: 'app-member-card',
  templateUrl: './member-card.component.html',
  styleUrls: ['./member-card.component.css']
})
export class MemberCardComponent implements OnInit {
@Input() member: IMember;
onlineUsers$ = new Observable<string[]>();
  constructor(private memberService: MembersService, private toastr: ToastrService,
              private presenceService: PresenceService) { }

  ngOnInit(): void {
    this.onlineUsers$ = this.presenceService.onlineUsers$;
  }

  addLike(member: IMember): void{
    this.memberService.addLike(member.username).subscribe(() => {
      this.toastr.success('You have liked ' + member.knownAs);
    }) ;
  }

}
