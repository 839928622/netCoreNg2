import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxGalleryAnimation, NgxGalleryImage, NgxGalleryOptions } from '@kolkov/ngx-gallery';
import { TabDirective, TabsetComponent } from 'ngx-bootstrap/tabs';
import { TimeagoIntl } from 'ngx-timeago';
import { take } from 'rxjs/operators';
import { IMember } from 'src/app/models/member';
import { IMessage } from 'src/app/models/message';
import { IUser } from 'src/app/models/user';
import { AccountService } from 'src/app/services/account.service';
import { MembersService } from 'src/app/services/members.service';
import { MessageService } from 'src/app/services/message.service';


@Component({
  selector: 'app-member-detail',
  templateUrl: './member-detail.component.html',
  styleUrls: ['./member-detail.component.css']
})
export class MemberDetailComponent implements OnInit, OnDestroy {
  @ViewChild('memberTabs', {static: true }) memberTabs: TabsetComponent;
  activaTab: TabDirective;
  messages: IMessage[] = [];
  member: IMember;
  galleryOPtions: NgxGalleryOptions[];
  galleryImages: NgxGalleryImage[];
  currentUser: IUser;

  constructor(private memberService: MembersService, private route: ActivatedRoute,
              intl: TimeagoIntl, private messageService: MessageService, private accountService: AccountService) {
    // intl.strings = stringsEs;
    // intl.changes.next();
     this.accountService.currentUser$.pipe(take(1)).subscribe(user => {
       this.currentUser = user;
     });
   }
  ngOnDestroy(): void {
    this.messageService.stopHubConnection();
  }

  ngOnInit(): void {

    this.route.data.subscribe(data => {
      this.member = data.member;
    });

    this.route.queryParams.subscribe(params => {
      params.tab ? this.selectTab(params.tab) : this.selectTab(0);
    });

    // galleryOPtions[]
    this.galleryOPtions = [
      {
        width: '500px', height: '500px', imagePercent: 100, thumbnailsColumns: 4,
        imageAnimation: NgxGalleryAnimation.Slide,
        preview: false
      }
    ];

    this.galleryImages = this.member.photos.map( (element) => {
      return {small: element?.url, medium: element?.url, big: element?.url};
    });


  }

  // getImages(): NgxGalleryImage[] {
  //  const imageUrls = [];
  //  for (const photo of this.member.photos)
  //  {
  //    imageUrls.push({small: photo?.url, medium: photo?.url, big: photo?.url});
  //  }
  //  return imageUrls;
  // }

  //  loadMember(): void {
  //   this.memberService.getMember(this.route.snapshot.paramMap.get('username')).subscribe(member => {

  //     this.member = member;
  //      // this. gelleryImage[]

  //   });
  // }

  onTabActivated(data: TabDirective): void
  {
    this.activaTab = data;
    if (this.activaTab.heading === 'Messages' && this.messages.length === 0) {
     // this.loadMessages();
      this.messageService.createHubConnection(this.currentUser, this.member.userName);
    } else{
      this.messageService.stopHubConnection();
    }
  }

  loadMessages(): void {
    this.messageService.getMessageThread(this.member.userName).subscribe(messages => {
      this.messages = messages;
    });
  }

  selectTab(tabId: number): void{
   this.memberTabs.tabs[tabId].active = true;
  }


}
