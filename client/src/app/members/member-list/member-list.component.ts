import { Component, OnInit } from '@angular/core';
import { IPagination } from 'src/app/models/IPagination';
import { IMember } from 'src/app/models/member';
import { MemberFilter } from 'src/app/models/memberFilter';
import { MembersService } from 'src/app/services/members.service';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.css']
})
export class MemberListComponent implements OnInit {
  members: IMember[];
  pagination: IPagination;
  pageNumber = 1;
  pageSize = 5;
  memberFilter = new MemberFilter();
  genderOptions = [{value: 'male', display: 'member-list.males'}, {value: 'female', display: 'member-list.females'}];
  constructor(private memberService: MembersService) { }

  ngOnInit(): void {
    this.loadMembers();
  }

  loadMembers(): void {
    this.memberService.getMembers(this.memberFilter).subscribe(response => {
      this.members = response.result;
      this.pagination = response.pagination;
    });
  }

  pageChanged($event): void {
    this.memberFilter.pageNumber = $event.page;
    // this.pageSize = $event.itemsPerPage;
    this.loadMembers();
  }

  resetFilters(): void{
    this.memberFilter = new MemberFilter();
    this.loadMembers();
  }

}
