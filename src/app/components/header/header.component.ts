import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Store } from '@ngrx/store';
import { LOADING_STATUS, UserState } from '../../reducers/app.states';
import * as actions from '../../actions/user.actions';
import { Subject, debounceTime, of, switchMap, takeUntil } from 'rxjs';
import { User } from '../../models/user';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    FormsModule,
    MatIconModule,
    MatInputModule,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  searchSubject = new Subject<string>();
  private readonly store = inject(Store<UserState>);
  router = inject(Router);
  showSearch: boolean = false;
  destroy$ = new Subject<void>();

  constructor(private readonly userService: UserService) {}

  ngOnInit() {
    // Subscribe to router events to check the current route
    this.router.events.pipe(takeUntil(this.destroy$)).subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.checkRoute();
      }
    });
    this.searchSubject
      .pipe(
        debounceTime(700),
        switchMap((userId) => {
          this.store.dispatch(actions.ClearSearchAction());
          if (!userId) return of(null);
          this.store.dispatch(
            actions.LoadingStatusChange({
              loading_status: LOADING_STATUS.LOADING,
            })
          );
          return this.userService.findUser(+userId);
        }),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (user: User | null) => {
          if (!user) return;
          if (user.id)
            return this.store.dispatch(actions.LoadUserSuccess(user));

          this.store.dispatch(
            actions.LoadingStatusChange({
              loading_status: LOADING_STATUS.NOT_LOADED,
            })
          );
        },
      });
  }

  /**
   * Check if the current URL ends with the '/users' route to display the input search
   */
  checkRoute() {
    this.showSearch = this.router.url.endsWith('/users');
  }

  searchUser(event: Event) {
    const val = (event.target as HTMLInputElement).value;
    this.searchSubject.next(val);
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.destroy$.next();
    this.destroy$.complete();
  }
}
