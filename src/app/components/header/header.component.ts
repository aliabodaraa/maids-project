import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import { Store } from '@ngrx/store';
import { STATUS, UserState } from '../../reducers/app.states';
import * as fromActions from '../../actions/user.actions';
import { Subject, switchMap, take, throttleTime } from 'rxjs';
import { HttpRequestHandler } from '../../handlers/http-request-handler';
import { User } from '../../models/user';
import { UserService } from '../../services/user.service';
import { StoreHandler } from '../../handlers/store-handler';
import { LocalStorageHandler } from '../../handlers/local-storage-handler';

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
    MatInputModule
  ],
  templateUrl:'./header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  searchSubject=new Subject<number>();
  storeHandler=inject(StoreHandler);
  localStorageHandler=inject(LocalStorageHandler);
httpRequestHandler=inject(HttpRequestHandler)
  private store= inject(Store<UserState>);
  constructor(private userService:UserService){
    this.searchSubject.pipe(throttleTime(200)).pipe(
      switchMap(userId=>{
        this.store.dispatch(fromActions.LoadingStatusChange({status:STATUS.LOADING}))
        return this.userService.findUser(userId,[this.storeHandler,this.localStorageHandler,this.httpRequestHandler]).pipe(take(1))
      })
    ).subscribe((user:User|null)=>{
      if(user){
        this.store.dispatch(fromActions.GetByIdSuccessAction(user));
      }else{
        this.store.dispatch(fromActions.GetByIdFailureAction({error:new Error("No data found")}));
        this.store.dispatch(fromActions.LoadingStatusChange({status:STATUS.NOT_LOADED}))

      }
    });
  }

  searchUser(event:Event){
    //TODO Directive
    const val=+(event.target as HTMLInputElement).value
    if(val)
      return this.searchSubject.next(val)
    this.store.dispatch(fromActions.ClearSearchAction());
  }

}
