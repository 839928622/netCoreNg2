import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { getPaginationHeader, getPaginationResult } from './paginationHelper';
import { IMessage } from '../models/message';
import { Observable } from 'rxjs';
import { PaginatedResult } from '../models/IPagination';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  baseUrl = environment.baseUrl;
  constructor(private http: HttpClient) { }

  getMessages(pageNumber: number, pageSize: number, container: string): Observable<PaginatedResult<IMessage[]>>{
    let params = getPaginationHeader(pageNumber, pageSize);
    params = params.append('Container', container);

    return getPaginationResult<IMessage[]>(this.baseUrl + 'messages', params, this.http);
  }

  getMessageThread(username: string): Observable<IMessage[]> {
    return this.http.get<IMessage[]>(this.baseUrl + 'messages/thread/' + username);
  }

  sendMessage(username: string, content: string): Observable<IMessage> {
    return this.http.post<IMessage>(this.baseUrl + 'messages', {recipientUsername: username, content});
  }

  deleteMessage(messageId: number): Observable<object> {
    return this.http.delete(this.baseUrl + 'messages/' + messageId);
  }
}
