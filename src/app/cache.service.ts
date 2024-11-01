import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserCacheService {

  constructor() { }
  getCachedUsers(page:any):Observable<any>{
    return of({})
  }
  cacheUsers(page:any,data?:any){
  }
}
