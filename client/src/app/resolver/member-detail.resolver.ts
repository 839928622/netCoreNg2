import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { IMember } from '../models/member';
import { MembersService } from '../services/members.service';

@Injectable({
  providedIn: 'root'
})
export class MemberDetailResolver implements Resolve<IMember> {
  constructor(private memberService: MembersService) {}
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IMember> {
    return this.memberService.getMember(route.paramMap.get('username'));
  }
}
