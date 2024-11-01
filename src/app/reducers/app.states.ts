import { User, UsersInfo } from '../models/user';

export interface AppState {
	userState: UserState;
}
export enum STATUS{
	NOT_LOADED='NOT_LOADED',
	NOT_LOADING='NOT_LOADING',
	LOADING='LOADING',
	LOADED='LOADED'
}
export interface UserState {
	page: number;
	usersInfo: UsersInfo;
	selectedUser: User|null;
	status: STATUS;
	error: any;
	searchedUser: User|null;
}