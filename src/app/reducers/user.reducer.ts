import { createFeatureSelector, createSelector, createReducer, on, Action } from '@ngrx/store';
import * as fromActions from '../actions/user.actions';
import { STATUS, UserState } from './app.states';

export const initialState: UserState = {
  page:0,
  usersInfo: {
    data: [],
    page:1,
    per_page:1,
    total:1,
    total_pages:1,
  },
  selectedUser: null,
  error: null,
  status: STATUS.NOT_LOADED,
  searchedUser:null
};

// Creating reducer
const _userReducer = createReducer(
  initialState,
  on(fromActions.LoadUsers, (state,{page}) => ({ ...state ,page, status:STATUS.LOADING})),
  on(fromActions.LoadUsersSuccess, (state, usersInfo) => ({ ...state, status:STATUS.LOADED, usersInfo })),
  on(fromActions.LoadUsersFailure, (state, { error }) => ({ ...state,status:STATUS.NOT_LOADED, error })),
  on(fromActions.LoadUserSuccess, (state, { user }) => ({ ...state, selectedUser:user, status:STATUS.LOADED})),
  on(fromActions.PaginatorChange, (state,{page}) => ({ ...state ,page , status:STATUS.LOADED})),
  on(fromActions.LoadingStatusChange, (state,{status}) => ({ ...state ,status})),
  on(fromActions.GetByIdSuccessAction, (state, searchedUser) => ({ ...state, searchedUser, status:STATUS.LOADED})),
  on(fromActions.GetByIdFailureAction, (state,error) => ({ ...state, searchedUser:null,selectedUser:null, error, status:STATUS.NOT_LOADED})),    
  on(fromActions.ClearSearchAction, (state) => ({ ...state, searchedUser:null, status:STATUS.NOT_LOADING})),    

);

export function userReducer(state: any, action: Action) {
  return _userReducer(state, action);
}

// Creating selectors
export const getUsersInfotate = createFeatureSelector<UserState>('userState');

export const getUsersInfo = createSelector(
    getUsersInfotate, 
    (state: UserState) => state.usersInfo 
);

export const getError = createSelector(
  getUsersInfotate, 
  (state: UserState) => state.error
);

export const getSelectedUser = createSelector(
  getUsersInfotate, 
  (state: UserState) => state.selectedUser
);
export const getPage = createSelector(
  getUsersInfotate, 
  (state: UserState) => state.page
);
export const getLoadingState = createSelector(
  getUsersInfotate, 
  (state: UserState) => state.status
);
export const getPageIndex = createSelector(
  getUsersInfotate, 
  (state: UserState) => state.usersInfo.page
);

export const getSearchedUser = createSelector(
  getUsersInfotate, 
  (state: UserState) => state.searchedUser
);
