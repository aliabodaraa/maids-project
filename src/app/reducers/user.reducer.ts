import {
  createFeatureSelector,
  createSelector,
  createReducer,
  on,
  Action,
} from '@ngrx/store';
import * as fromActions from '../actions/user.actions';
import { LOADING_STATUS, UserState } from './app.states';

export const initialState: UserState = {
  page: 0,
  usersInfo: {
    data: [],
    page: 1,
    per_page: 1,
    total: 1,
    total_pages: 1,
  },
  selectedUser: null,
  error: null,
  loading_status: LOADING_STATUS.NOT_LOADING,
  searchedUser: null,
};

// Creating reducer
const _userReducer = createReducer(
  initialState,
  on(fromActions.LoadUsers, (state, { page }) => ({
    ...state,
    page,
    loading_status: LOADING_STATUS.LOADING,
  })),
  on(fromActions.LoadUsersSuccess, (state, usersInfo) => ({
    ...state,
    loading_status: LOADING_STATUS.LOADED,
    usersInfo,
  })),
  on(fromActions.LoadUsersFailure, (state, { error }) => ({
    ...state,
    loading_status: LOADING_STATUS.NOT_LOADED,
    error,
  })),

  on(fromActions.LoadingStatusChange, (state, { loading_status }) => ({
    ...state,
    loading_status,
  })),

  on(fromActions.LoadUserSuccess, (state, searchedUser) => ({
    ...state,
    searchedUser,
    loading_status: LOADING_STATUS.LOADED,
  })),

  on(fromActions.ClearSearchAction, (state) => ({
    ...state,
    searchedUser: null,
    loading_status: LOADING_STATUS.NOT_LOADING,
  }))
);

export function userReducer(state: any, action: Action) {
  return _userReducer(state, action);
}

// Creating selectors
export const getUsersInfoState = createFeatureSelector<UserState>('userState');

export const getUsersInfo = createSelector(
  getUsersInfoState,
  (state: UserState) => state.usersInfo
);

export const getError = createSelector(
  getUsersInfoState,
  (state: UserState) => state.error
);

export const getSelectedUser = createSelector(
  getUsersInfoState,
  (state: UserState) => state.selectedUser
);
export const getPage = createSelector(
  getUsersInfoState,
  (state: UserState) => state.page
);
export const getLoadingState = createSelector(
  getUsersInfoState,
  (state: UserState) => state.loading_status
);
export const getPageIndex = createSelector(
  getUsersInfoState,
  (state: UserState) => state.usersInfo.page
);

export const getSearchedUser = createSelector(
  getUsersInfoState,
  (state: UserState) => state.searchedUser
);
