import { AuthService } from './../service/auth.service';
import { AuthStatusService } from './../auth-status.service';
import { TokenService } from './../service/token.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  loggedIn;
  constructor(private token:TokenService,private auth:AuthService,private authS:AuthStatusService) { }

  ngOnInit(): void {
    this.authS.loggedInObs.subscribe(
      (data) => this.loggedIn = data
    )
  }
logout(e){
  e.preventDefault();
  this.token.removeToken();
  this.authS.changeStatus();
  sessionStorage.removeItem('user_id');
  this.auth.logoutSub.next();
}
}
