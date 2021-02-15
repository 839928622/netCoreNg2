import { Component, OnInit } from '@angular/core';
import { IMember } from '../models/member';
import { MembersService } from '../services/members.service';

@Component({
  selector: 'app-lists',
  templateUrl: './lists.component.html',
  styleUrls: ['./lists.component.css']
})
export class ListsComponent implements OnInit {
  members: Partial<IMember[]>;
  predicate = 'liked';

  constructor(private memberService: MembersService) { }

  ngOnInit(): void {
    this.loadLikes();
  }

  loadLikes(): void{
    this.memberService.getLikes(this.predicate).subscribe(response => {
      this.members = response;
    });
  }
}
