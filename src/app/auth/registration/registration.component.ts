import { AuthService } from './../../service/auth.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {
  form = {
    name:null,
    email:null,
    password:null,
    password_confirmation:null
  }
  success;
  errors = {
    name:null,
    email:null,
    password:null
  };
  constructor(private auth:AuthService) { }

  ngOnInit(): void {
  }

signup(f){
  this.auth.signup(this.form).subscribe(
    (data:any) => {
      this.success = data.success;
      f.reset();
    },
    (error)=>this.errors = error.error.errors
  )
}
}
