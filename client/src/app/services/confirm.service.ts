import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { ConfirmDialogComponent } from '../modals/confirm-dialog/confirm-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class ConfirmService {
  bsModelRef: BsModalRef;
  title: string; message: string; btnOkText: string; btnCancelText: string;

  constructor(private modalService: BsModalService, private translate: TranslateService) {
    this.translate.stream('confirm-service.title').pipe(take(1)).subscribe((title: string) => {
      this.title = title;
    });
    this.translate.stream('confirm-service.message').pipe(take(1)).subscribe((message: string) => {
      this.message = message;
    });
    this.translate.stream('confirm-service.btnOkText').pipe(take(1)).subscribe((btnOkText: string) => {
      this.btnOkText = btnOkText;
    });
    this.translate.stream('confirm-service.btnCancelText').pipe(take(1)).subscribe((btnCancelText: string) => {
      this.btnOkText = btnCancelText;
    });
  }
  // tslint:disable-next-line: max-line-length
  confirm(title = this.title, message= this.message, btnOkText = this.btnOkText, btnCancelText = this.btnCancelText): Observable<boolean>
  {
    // just like we use modal to modify user's roles
    // we came up with some configuration
    const config = {
     initialState : {
      title,
      message,
      btnOkText,
      btnCancelText
     }
    };
    this.bsModelRef = this.modalService.show(ConfirmDialogComponent, config);
    return new Observable<boolean>(this.getResult());

  }


  // tslint:disable-next-line: typedef
  private getResult() {
    return (observer) => {
      const subscription = this.bsModelRef.onHidden.subscribe( () => {
      observer.next(this.bsModelRef.content.result);
      observer.complete();
     }
     );
      return {
       unsubscribe(): void {
         subscription.unsubscribe();
       }
     };
   };
  }
}
