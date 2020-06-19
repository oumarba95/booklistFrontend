import { tap } from 'rxjs/operators';
import { TokenService } from './token.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  server = 'http://localhost:8000/api/';
  userIdSub = new Subject<number>();
  logoutSub = new Subject<any>();
  constructor(private http:HttpClient,private token:TokenService) { }

  login(data){
    return this.http.post(this.server+'login',data).pipe(
      tap((data:any)=> this.userIdSub.next(data.user_id))
    )
  }
 
  signup(data){
    return this.http.post(this.server+'signup',data);
  }
  logout(){

  }
}
