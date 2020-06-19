import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  url='http://localhost:8000/api/login';
  constructor() { }

  saveToken(token){
    localStorage.setItem('token',token);
  }
  getToken(){
    return localStorage.getItem('token');
  }
  removeToken(){
     localStorage.removeItem('token');
  }
  isValid(){
    const token = this.getToken();
    if(token){
      const vari = token.split('.')[1]
      const payload = JSON.parse(atob(vari));
      if(this.url == payload.iss)
        return true;
    }
    return false;
  }
 
  loggeIn(){
   return this.isValid();
}
}
