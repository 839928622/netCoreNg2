import { take } from 'rxjs/operators';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { getPaginationHeader, getPaginationResult } from './paginationHelper';
import { IMessage } from '../models/message';
import { BehaviorSubject, Observable } from 'rxjs';
import { PaginatedResult } from '../models/IPagination';
import { IUser } from '../models/user';
import { IGroup } from '../models/group';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  baseUrl = environment.baseUrl;
  hubUrl = environment.hubUrl;
  private HubConnection: HubConnection;
  private messageThreadSource = new BehaviorSubject<IMessage[]>([]);
  messageThread$ = this.messageThreadSource.asObservable();
  constructor(private http: HttpClient) { }

  createHubConnection(user: IUser, otherUsername: string): void {
    this.HubConnection = new HubConnectionBuilder()
    .withUrl(this.hubUrl + 'message?user=' + otherUsername, {
      accessTokenFactory: () => user.token
    }).withAutomaticReconnect().build();

    this.HubConnection.start().catch(error => console.log(error));

    // listening
    this.HubConnection.on('ReceiveMessageThread', (messages: IMessage[]) => {
      console.log('messagesThread', messages);
      this.messageThreadSource.next(messages);
    });
    // new message
    this.HubConnection.on('NewMessage', (singleNewMessages: IMessage) => {
      this.messageThread$.pipe(take(1)).subscribe(oldMessages => {
        // merge old messages and new single message
        this.messageThreadSource.next([...oldMessages, singleNewMessages ]);
      });
    });

     // listening on  group status
    this.HubConnection.on('UpdatedGroup', (group: IGroup) => {
      if (group.connections.some(x => x.username === otherUsername)) {
        this.messageThread$.pipe(take(1)).subscribe(oldMessages => {
          oldMessages.forEach(message => {
            if (message.dateRead === null) {
              message.dateRead = new Date(Date.now());
            }
          });
          this.messageThreadSource.next([...oldMessages]);
        });
      }

    });
  }

  stopHubConnection(): void {
  if (this.HubConnection) {
    this.HubConnection.stop();
  }
  }
  getMessages(pageNumber: number, pageSize: number, container: string): Observable<PaginatedResult<IMessage[]>>{
    let params = getPaginationHeader(pageNumber, pageSize);
    params = params.append('Container', container);

    return getPaginationResult<IMessage[]>(this.baseUrl + 'messages', params, this.http);
  }

  getMessageThread(username: string): Observable<IMessage[]> {
    return this.http.get<IMessage[]>(this.baseUrl + 'messages/thread/' + username);
  }

  async sendMessage(username: string, content: string): Promise<any>{
    // return this.http.post<IMessage>(this.baseUrl + 'messages', {recipientUsername: username, content});
    try {
      return this.HubConnection.invoke('SendMessage', { recipientUsername: username, content });
    } catch (error) {
      return console.log(error);
    }
  }

  deleteMessage(messageId: number): Observable<object> {
    return this.http.delete(this.baseUrl + 'messages/' + messageId);
  }
}
