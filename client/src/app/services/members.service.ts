import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { PaginatedResult } from '../models/IPagination';
import { IMember } from '../models/member';
import { MemberFilter } from '../models/memberFilter';

// const httpOptions = {
//   headers: new HttpHeaders({
//     Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('user')).token
//   })
// };

@Injectable({
  providedIn: 'root'
})
export class MembersService {
  baseUrl = environment.baseUrl;
  paginationResult: PaginatedResult<IMember[]> = new  PaginatedResult<IMember[]>();
  constructor(private http: HttpClient) { }

  getMembers(memberFilter: MemberFilter): Observable<PaginatedResult<IMember[]>> {
     let params = this.producePaginationHeaders(memberFilter.pageNumber, memberFilter.pageSize);

     params = params.append('maxAge', memberFilter.maxAge.toString());
     params = params.append('minAge', memberFilter.minAge.toString());
     params = params.append('orderBy', memberFilter.orderBy);
     if (memberFilter.gender) {
      params = params.append('gender', memberFilter.gender);
     }

     return this.http.get<IMember[]>(this.baseUrl + 'users/getUsers', {observe: 'response', params}).pipe(
      map(response => {
        this.paginationResult.result = response.body;
        if (response.headers.get('Pagination') !== null) {
          this.paginationResult.pagination = JSON.parse(response.headers.get('Pagination'));
        }
        return this.paginationResult;
      })
    );
  }

  private producePaginationHeaders(pageNumber: number, pageSize: number): HttpParams {
    let params = new HttpParams();
      // params.append('pageNumber', pageNumber.toString()); == http://localhost/users?pageNumber=pageNumber
    params = params.append('pageNumber', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());
    return params;
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

  addLike(username: string): Observable<object> {
    return this.http.post(this.baseUrl + 'like/' + username, {});
  }

  getLikes(predicate: string): Observable<Partial<IMember[]>>{
    return this.http.get<Partial<IMember[]>>(this.baseUrl + 'like?predicate=' + predicate);
  }
}
