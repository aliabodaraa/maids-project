import { createAction, props } from '@ngrx/store';
import { User, UsersInfo } from '../models/user';
import { STATUS } from '../reducers/app.states';

export const ShowAllAction = createAction('[USER] Show All');
export const ShowAllSuccessAction = createAction('[USER] Show All Success', props<{ payload: User[]}>());
export const CreateAction = createAction('[USER] Create', props<{ payload: User}>());
export const CreateSuccessAction = createAction('[LoadUsersSuccess] Create Success', props<{ payload: User}>());
export const CreateFailureAction = createAction('[USER] Create Failure', props<{ payload: any}>());
export const GetByIdAction = createAction('[USER] Get by Id', props<{ payload: number}>());
export const ResetAction = createAction('[USER] Reset');

export const LoadUserSuccess = createAction('[USER] Show User Success', props<{user: User}>());
export const LoadUsers = createAction('[USER] Show All', props<{ page: number }>());
export const LoadUsersSuccess = createAction('[USER] Success', props<UsersInfo>());
export const LoadUsersFailure = createAction('[USER] Failure', props<{ error: any}>());
export const SelectedUser = createAction('[USER] Specific Success', props<{ userId: number}>());
export const PaginatorChange = createAction('[USER] paginator Changed', props<{ page: number}>());
export const LoadingStatusChange = createAction('[USER] Loading Status Change', props<{ status: STATUS}>());
export const GetByIdSuccessAction = createAction('[USER] Get by Id Success', props<User>());
export const GetByIdFailureAction = createAction('[USER] Get by Id Failed',props<{ error: any}>());
export const ClearSearchAction = createAction('[USER] Clear search results');

