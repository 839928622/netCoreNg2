import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject } from 'rxjs';
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
  constructor(private toastr: ToastrService) { }

  // we cant use http interceptor to handle authentication info
  createHubConnection(user: IUser): void {
    this.hubConnection = new HubConnectionBuilder()
          .withUrl(this.hubUrl + 'presence', { accessTokenFactory: () => user.token })
          .withAutomaticReconnect()
          .build();

    this.hubConnection.start().catch( error => console.log(error));
    // user connected
    this.hubConnection.on('UserIsOnline', username => {
      this.toastr.info(username + ' has connected');
    });
   // user disconnected
    this.hubConnection.on('UserIsOffline', username => {
      this.toastr.warning(username + ' has disconnected');
    });
    // onlineUsers
    this.hubConnection.on('GetOnlineUsers', (onlineUsers: string[]) => {
      console.log('onlineUsers', onlineUsers);
      this.onlineUsersSource.next(onlineUsers);
    });
  }

  stopHubConnection(): void {
    this.hubConnection.stop().catch(error => console.log(error));
  }
}
