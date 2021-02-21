import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject } from 'rxjs';
import { take } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { IUser } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class PresenceService {
  hubUrl = environment.hubUrl;
  private hubConnection: HubConnection;
  private onlineUsersSource = new BehaviorSubject<string[]>([]);
  onlineUsers$ = this.onlineUsersSource.asObservable();
  constructor(private toastr: ToastrService, private router: Router) { }

  // we cant use http interceptor to handle authentication info
  createHubConnection(user: IUser): void {
    this.hubConnection = new HubConnectionBuilder()
          .withUrl(this.hubUrl + 'presence', { accessTokenFactory: () => user.token })
          .withAutomaticReconnect()
          .build();

    this.hubConnection.start().catch( error => console.log(error));
    // user connected
    this.hubConnection.on('UserIsOnline', newOnlineUsername => {
      // onlineUserList actually are online username list
      this.onlineUsers$.pipe(take(1)).subscribe((oldOnlineUserList) => {
      this.onlineUsersSource.next([...newOnlineUsername, oldOnlineUserList]);
      });
      this.toastr.info(newOnlineUsername + ' has connected');
    });
   // user disconnected
    this.hubConnection.on('UserIsOffline', newOfflineUsername => {
      this.onlineUsers$.pipe(take(1)).subscribe((OnlineUserList) => {
        this.onlineUsersSource.next([...OnlineUserList.filter(u => u !== newOfflineUsername)]);
        });
      this.toastr.warning(newOfflineUsername + ' has disconnected');
    });
    // onlineUsers
    this.hubConnection.on('GetOnlineUsers', (onlineUsers: string[]) => {
      console.log('onlineUsers', onlineUsers);
      this.onlineUsersSource.next(onlineUsers);
    });
     // new message received
    this.hubConnection.on('NewMessageReceived', ({ username, knownAs}) => {
      this.toastr.info(knownAs + ' has sent you a new message!').onTap.pipe(
        take(1)).subscribe(
          () => { this.router.navigateByUrl('/members/' + username + '?tab=3'); });
    });
  }

  stopHubConnection(): void {
    this.hubConnection.stop().catch(error => console.log(error));
  }
}
