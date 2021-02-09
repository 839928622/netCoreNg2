import { Component, Input, OnInit } from '@angular/core';
import { FileUploader } from 'ng2-file-upload';
import { take } from 'rxjs/operators';
import { IMember } from 'src/app/models/member';
import { IPhoto } from 'src/app/models/photo';
import { IUser } from 'src/app/models/user';
import { AccountService } from 'src/app/services/account.service';
import { MembersService } from 'src/app/services/members.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-photo-editor',
  templateUrl: './photo-editor.component.html',
  styleUrls: ['./photo-editor.component.css']
})
export class PhotoEditorComponent implements OnInit {
  @Input() member: IMember;
  uploader: FileUploader;
  hasBaseDropzoneOver = false;
  baseUrl = environment.baseUrl;
  currentUser: IUser;
  constructor(private accountService: AccountService, private memberService: MembersService) {
    this.accountService.currentUser$.pipe(take(1)).subscribe(user => {
      this.currentUser = user;
    });
  }

  ngOnInit(): void {
    this.initializeUploader();
  }

  fileOverBase(e: any): void{
    this.hasBaseDropzoneOver = e;
  }

  initializeUploader(): void {
    this.uploader = new FileUploader({
     url: this.baseUrl + 'users/add-photo',
     authToken: 'Bearer ' + this.currentUser.token,
     isHTML5: true,
     allowedFileType: ['image'],
     removeAfterUpload: true,
     autoUpload: false,
     maxFileSize: 10 * 1024 * 1024
    });

    this.uploader.onAfterAddingFile = (file) => {
      file.withCredentials = false;
    };
    this.uploader.onSuccessItem = (item, response, status, headers) => {
      if (response) {
        const photo: IPhoto = JSON.parse(response);
        this.member.photos.push(photo);
        if (photo.isMain) {
          this.currentUser.mainPhotoUrl = photo.url;
          this.member.mainPhotoUrl = photo.url;
          this.accountService.setCurrentUser(this.currentUser);
        }
      }
    };

  }

  setMainPhoto(photo: IPhoto): void {
    this.memberService.setMainPhoto(photo.id).subscribe(() => {
      this.currentUser.mainPhotoUrl = photo.url;
      this.accountService.setCurrentUser(this.currentUser);
      this.member.mainPhotoUrl = photo.url;
      this.member.photos.forEach((e, index) => {
         if (e.isMain) { e.isMain = false; }
         if (e.id === photo.id) { e.isMain = true; }
      });
    });
  }

  deletePhoto(photoId: number): void {
    this.memberService.deletePhoto(photoId).subscribe( () => {
     this.member.photos = this.member.photos.filter(x => x.id !== photoId);
    });
  }

}
