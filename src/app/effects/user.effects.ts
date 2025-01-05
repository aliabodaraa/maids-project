import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, catchError, exhaustMap } from 'rxjs/operators';
import * as fromActions from '../actions/user.actions';
import { UserService } from '../services/user.service';
import { UsersInfo } from '../models/user';

@Injectable()
export class UserEffects {
  private readonly actions$ = inject(Actions);
  private readonly userService = inject(UserService);

  loadAllUsers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromActions.LoadUsers),
      exhaustMap(({ page }: { page: number }) => {
        return this.userService.getAllUsers(page).pipe(
          map((usersInfo: UsersInfo) =>
            fromActions.LoadUsersSuccess(usersInfo)
          ),
          catchError((error) => of(fromActions.LoadUsersFailure(error)))
        );
      })
    )
  );
}
