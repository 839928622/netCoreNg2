import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxGalleryAnimation, NgxGalleryImage, NgxGalleryOptions } from '@kolkov/ngx-gallery';
import { TabDirective, TabsetComponent } from 'ngx-bootstrap/tabs';
import { TimeagoIntl } from 'ngx-timeago';
import { IMember } from 'src/app/models/member';
import { IMessage } from 'src/app/models/message';
import { MembersService } from 'src/app/services/members.service';
import { MessageService } from 'src/app/services/message.service';


@Component({
  selector: 'app-member-detail',
  templateUrl: './member-detail.component.html',
  styleUrls: ['./member-detail.component.css']
})
export class MemberDetailComponent implements OnInit {
  @ViewChild('memberTabs', {static: true }) memberTabs: TabsetComponent;
  activaTab: TabDirective;
  messages: IMessage[] = [];
  member: IMember;
  galleryOPtions: NgxGalleryOptions[];
  galleryImages: NgxGalleryImage[];

  constructor(private memberService: MembersService, private route: ActivatedRoute,
              intl: TimeagoIntl, private messageService: MessageService) {
    // intl.strings = stringsEs;
    // intl.changes.next();
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
      this.loadMessages();
    }
  }

  loadMessages(): void {
    this.messageService.getMessageThread(this.member.username).subscribe(messages => {
      this.messages = messages;
    });
  }

  selectTab(tabId: number): void{
   this.memberTabs.tabs[tabId].active = true;
  }


}
