import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user';

@Injectable()
export class UserFakeService {
    constructor(private http: HttpClient) { }

    url = "/api/users";
    getAllUsers(): Observable<User[]> {
        return this.http.get<User[]>(this.url);
    }
    createUser(user: User): Observable<User> {
        return this.http.post<User>(this.url, user);
    }
    getUserById(id: string): Observable<User[]> {
        console.log(id);
        return this.http.get<User[]>(this.url + '?id=' + id);
    }    
}
