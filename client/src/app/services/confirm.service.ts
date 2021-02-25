import { Injectable } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Observable } from 'rxjs';
import { ConfirmDialogComponent } from '../modals/confirm-dialog/confirm-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class ConfirmService {
  bsModelRef: BsModalRef;
  constructor(private modalService: BsModalService) {}
  // tslint:disable-next-line: max-line-length
  confirm(title = 'Confirmation', message= 'Are you sure you wannt to do this?', btnOkText = 'OK', btnCancelText = 'Cancel'): Observable<boolean>
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
