import { User } from '../models/user';
import { Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';
import { BaseHandler } from './base-handler';
import { HandlerUtility } from './handler-utility.service';
import { Handlers_Types } from './handler.type';

@Injectable({
  providedIn: 'root',
})
/**
 * A handler which can be connected in a chain,
 * Checks the existince of a user in the local storage if it found return it otherwise pass the input to the next handler [nextHandler]
 */
export class LocalStorageHandler extends BaseHandler {
  constructor() {
    super();
    HandlerUtility.registerHandler(Handlers_Types.LocalStorageHandler, this);
  }
  check(userId: number): Observable<User | null> {
    let page = 1;
    let users;
    users = localStorage.getItem(`users_${page}`);
    while (users) {
      users = JSON.parse(users);
      users = users.data;
      for (const user of users) {
        if (user.id == userId) return of(user);
      }
      page++;
      users = localStorage.getItem(`users_${page}`);
    }
    return of(null);
  }
}
