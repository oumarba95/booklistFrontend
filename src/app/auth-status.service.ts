import { TokenService } from './service/token.service';
import { AuthService } from './service/auth.service';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthStatusService {
  loggedIn = new BehaviorSubject<boolean>(this.token.loggeIn());
  loggedInObs = this.loggedIn.asObservable();
  constructor(private token:TokenService) {
   }

  changeStatus(){
    this.loggedIn.next(false);
    sessionStorage.removeItem('user_id');
  }
}
