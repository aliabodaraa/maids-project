import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, of, tap } from 'rxjs';
import { User, UsersInfo } from '../models/user';
import { LocalStorageHandler } from '../handlers/local-storage-handler';
import { HttpRequestHandler } from '../handlers/http-request-handler';
import { StoreHandler } from '../handlers/store-handler';
import { UserSearchHandler } from '../handlers/search-handler.model';


@Injectable({
    providedIn:'root'
})
export class UserService {

    constructor(
        private http:HttpClient
    ) { }
    url = "https://reqres.in/api/users";
    getAllUsers(page:number): Observable<UsersInfo|null> {
        if(localStorage.getItem(`users_${page}`)) return of(JSON.parse(localStorage.getItem(`users_${page}`)!))
        return this.http.get<UsersInfo>(this.url + `?page=${page}`)
        .pipe(
            tap((usersInfo)=> localStorage.setItem(`users_${page}`,JSON.stringify(usersInfo))),
            catchError((err)=>{
                return of(null)
            })
        );
    }
    createUser(user: User): Observable<User> {
        return this.http.post<User>(this.url, user);
    }
    getUserById(id: number): Observable<User|undefined> {
        console.log("getUserById",id);
        return this.http.get<{data:User}|null>(this.url + `/${id}`).pipe(
            tap(x=>console.log(x)),
            map(data=>{
                if(data) return data.data;
                return undefined
            }),
            catchError((err)=>{
                return of(undefined)
            })
        );
    }


    /**
     * 
     * @param userId 
     * @param deps 
     * @returns 
     */
  findUser(userId:number ,deps:UserSearchHandler[]){
    deps.forEach((dep,i)=>{
        if(i!=deps.length-1)
            dep.setNext(deps[i+1])
    })
    return deps[0].handle(userId)
  }
}