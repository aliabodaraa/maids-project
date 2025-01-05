import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, map, of, tap, throwError } from 'rxjs';
import { User, UsersInfo } from '../models/user';
import { HandlerUtility } from '../handlers/handler-utility.service';
import { Handlers_Types } from '../handlers/handler.type';

const URL_API = 'https://reqres.in/api/users';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private readonly http: HttpClient) {}
  getAllUsers(page: number): Observable<UsersInfo> {
    if (localStorage.getItem(`users_${page}`))
      return of(JSON.parse(localStorage.getItem(`users_${page}`)!));
    return this.http.get<UsersInfo>(URL_API + `?page=${page}`).pipe(
      tap((usersInfo) =>
        localStorage.setItem(`users_${page}`, JSON.stringify(usersInfo))
      ),
      catchError((err) => {
        return throwError(() => new Error('Failed To Load Users Data'));
      })
    );
  }
  getUserById(id: number): Observable<User> {
    return this.http.get<{ data: User }>(URL_API + `/${id}`).pipe(
      map((data) => {
        return data.data;
      }),
      catchError((err: HttpErrorResponse) => {
        return of({ id: 0, first_name: '', last_name: '', avatar: '' });
      })
    );
  }

  /**
   *
   * @param userId
   * @param deps
   * @returns
   */
  findUser(
    userId: number,
    deps: Handlers_Types[] = [
      Handlers_Types.StoreHandler,
      Handlers_Types.LocalStorageHandler,
      Handlers_Types.HttpRequestHandler,
    ]
  ) {
    return HandlerUtility.link(deps)!.handle(userId);
  }
}
