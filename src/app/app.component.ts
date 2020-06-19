import { AuthService } from './service/auth.service';
import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent  implements OnInit{
  constructor(private title:Title){
    
  }
  ngOnInit(){
   

  }
  public setTitle(title:string){
    this.title.setTitle(title);
  }
}
