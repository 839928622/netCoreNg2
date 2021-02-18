import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IUser } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
 baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) { }

  getUsersWithRoles(): Observable<Partial<IUser[]>> {
    return this.http.get<Partial<IUser[]>>(this.baseUrl + 'admin/users-with-roles');
  }

  updateUserRoles(username: string, roles: string[]): Observable<object> {
    return this.http.post(this.baseUrl + 'admin/edit-roles/' + username + '?roles=' + roles, {});
  }
}
