import { Subject } from 'rxjs';
import { AuthStatusService } from './../../auth-status.service';
import { TokenService } from './../../service/token.service';
import { AuthService } from './../../service/auth.service';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  form = {
    email:null,
    password:null
  };
  error;
  constructor(private auth:AuthService,private route:ActivatedRoute,private router:Router,private token:TokenService,private authS:AuthStatusService) { }

  ngOnInit(): void {
  }
 login(){
   this.auth.login(this.form).subscribe(
     (data:any) => {
        this.token.saveToken(data.access_token);
        this.authS.loggedIn.next(true);
        this.auth.userIdSub.next(data.user_id);
        sessionStorage.setItem('user_id',data.user_id);
        this.auth.userIdSub.next(data.user_id);
        let from ;
        this.route.queryParams.subscribe(
          (params) => from = params['from']
        );
        if (from)
           this.router.navigateByUrl('/'+from);
        else
          this.router.navigateByUrl('/books');
     },
     (error)=>this.error = error.error.error
   )
 }
}