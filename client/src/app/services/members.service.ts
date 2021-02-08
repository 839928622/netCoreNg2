import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { IMember } from '../models/member';

const httpOptions = {
  headers: new HttpHeaders({
    Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('user')).token
  })
};

@Injectable({
  providedIn: 'root'
})
export class MembersService {
  baseUrl = environment.baseUrl;
  constructor(private http: HttpClient) { }

  getMembers(): Observable<IMember[]> {
    return this.http.get<IMember[]>(this.baseUrl + 'users/getUsers');
  }

  getMember(username): Observable<IMember>{
    return this.http.get<IMember>(this.baseUrl + 'users/GetUser/' + username);
  }

  updateMember(member: IMember): Observable<unknown> {
    return this.http.put(this.baseUrl + 'users', member);
  }

  setMainPhoto(photoId: number): Observable<object>{
    return this.http.put(this.baseUrl + 'users/set-main-photo/' + photoId, {});
  }

  deletePhoto(photoId: number): Observable<object> {
    return this.http.delete(this.baseUrl + 'users/delete-photo/' + photoId);
  }
}
