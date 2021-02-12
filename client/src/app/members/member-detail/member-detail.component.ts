import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxGalleryAnimation, NgxGalleryImage, NgxGalleryOptions } from '@kolkov/ngx-gallery';
import { TimeagoIntl } from 'ngx-timeago';
import { IMember } from 'src/app/models/member';
import { MembersService } from 'src/app/services/members.service';


@Component({
  selector: 'app-member-detail',
  templateUrl: './member-detail.component.html',
  styleUrls: ['./member-detail.component.css']
})
export class MemberDetailComponent implements OnInit {
  member: IMember;
  galleryOPtions: NgxGalleryOptions[];
  galleryImages: NgxGalleryImage[];

  constructor(private memberService: MembersService, private route: ActivatedRoute, intl: TimeagoIntl) {
    // intl.strings = stringsEs;
    // intl.changes.next();
   }

  ngOnInit(): void {
    this.loadMember();

    // galleryOPtions[]
    this.galleryOPtions = [
      {
        width: '500px', height: '500px', imagePercent: 100, thumbnailsColumns: 4,
        imageAnimation: NgxGalleryAnimation.Slide,
        preview: false
      }
    ];


  }

  // getImages(): NgxGalleryImage[] {
  //  const imageUrls = [];
  //  for (const photo of this.member.photos)
  //  {
  //    imageUrls.push({small: photo?.url, medium: photo?.url, big: photo?.url});
  //  }
  //  return imageUrls;
  // }

   loadMember(): void {
    this.memberService.getMember(this.route.snapshot.paramMap.get('username')).subscribe(member => {

      this.member = member;
       // this. gelleryImage[]
      this.galleryImages = this.member.photos.map( (element) => {
      return {small: element?.url, medium: element?.url, big: element?.url};
    });
    });
  }

}
