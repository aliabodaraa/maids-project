import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { combineLatest, forkJoin, of } from 'rxjs';
import { map, switchMap, mergeMap, catchError, debounceTime, tap, take, shareReplay, exhaustMap } from 'rxjs/operators';
import * as fromActions from '../actions/user.actions';
import { UserService } from '../services/user.service';
import { UserCacheService } from '../cache.service';
import { Store } from '@ngrx/store';
import { STATUS, UserState } from '../reducers/app.states';
import { getPage, getSelectedUser, getUsersInfo } from '../reducers/user.reducer';
import { User, UsersInfo } from '../models/user';

@Injectable()
export class UserEffects {
  private actions$ = inject(Actions);
  private userService = inject(UserService);
  private store = inject( Store<UserState>);
  constructor() {}

  loadAllUsers$ = createEffect(() => this.actions$.pipe(
    ofType(fromActions.LoadUsers),
    exhaustMap(({page}:{page:number}) =>{
        this.store.dispatch(fromActions.LoadingStatusChange({status:STATUS.LOADING}))
        return this.userService.getAllUsers(page).pipe(
          map((usersInfo:UsersInfo|null) => {
            if(!usersInfo) throw new Error()
            this.store.dispatch(fromActions.LoadingStatusChange({status:STATUS.LOADED}))
            return fromActions.LoadUsersSuccess(usersInfo);
          }),
          catchError(error => {
            this.store.dispatch(fromActions.LoadingStatusChange({status:STATUS.NOT_LOADED}))
            return of(fromActions.CreateFailureAction(error))}),
        )
      })
  ));

}