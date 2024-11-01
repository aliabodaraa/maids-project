import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Observable, map, share, shareReplay, take, tap } from 'rxjs';
import * as fromReducer from '../../reducers/user.reducer';
import { User, UsersInfo } from '../../models/user';
import { Store } from '@ngrx/store';
import { STATUS, UserState } from '../../reducers/app.states';

import * as fromActions from '../../actions/user.actions';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatPaginatorModule, PageEvent} from '@angular/material/paginator';
import {MatMenuModule} from '@angular/material/menu';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
  standalone:true,
  imports:[CommonModule,RouterModule,MatProgressSpinnerModule,MatMenuModule,MatPaginatorModule]
})
export class UserListComponent{

  @Output()
  detailsClicked = new EventEmitter<string | number>();
	usersInfo$: Observable<UsersInfo>;
  searchedUser$: Observable<User|null>;
	loading$: Observable<STATUS>;
  pageIndex:number=0;
  isSearchedUser=false
  searchedUser:User
  constructor(private store: Store<UserState>) { 
    this.usersInfo$ = this.store.select(fromReducer.getUsersInfo);
    //this.loadUsers(1)
    this.usersInfo$.pipe(take(1)).subscribe(users_info=>{
      if(!users_info.data.length){
          return this.loadUsers(1)
      }
    });
    
    this.loading$ = this.store.select(fromReducer.getLoadingState).pipe(shareReplay())
    this.store.select(fromReducer.getPageIndex).pipe(take(1)).subscribe(pageIndex=>this.pageIndex=pageIndex-1)
    this.store.select(fromReducer.getSearchedUser).subscribe(user=>{
      if(user)
        this.searchedUser=user
      this.isSearchedUser=!!user
    
    })
		this.searchedUser$ = this.store.select(fromReducer.getSearchedUser).pipe(shareReplay());

    
  }

  loadUsers(page:number){
		this.store.dispatch(fromActions.LoadUsers({page}));
	}
  onClick(user: User) {
    this.detailsClicked.emit(user.id);
  }
  paginatorChanged({pageIndex}:PageEvent){
    this.pageIndex=pageIndex;
    this.loadUsers(pageIndex+1);
  }
}