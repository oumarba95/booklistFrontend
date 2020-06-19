import { Router } from '@angular/router';
import { AuthStatusService } from './../auth-status.service';
import { TokenService } from './token.service';
import { LoaderService } from './loader.service';
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpHeaders } from '@angular/common/http';
import { delay, finalize, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppInterceptorService implements HttpInterceptor{
  loggedIn;
  constructor(private token:TokenService,private auth:AuthStatusService,private router:Router) { 
    this.auth.loggedInObs.subscribe(
      (data) => this.loggedIn = data
    )
  }
  intercept(req: import("@angular/common/http").HttpRequest<any>,next: import("@angular/common/http").HttpHandler): import("rxjs").Observable<import("@angular/common/http").HttpEvent<any>> {
    req = req.clone({
      setHeaders:{
        'Authorization':`Bearer ${this.token.getToken()}`,
      }
    }) ;
   
      return next.handle(req).pipe(
        catchError((error)=>{
             if(error.status == 401){
                 if(this.loggedIn){
                     this.auth.changeStatus();
                     this.router.navigateByUrl(`/login?from=${this.router.url}`);
                 }
                 else
                    this.router.navigateByUrl(`/login?from=${this.router.url}`);
             }
                
             return throwError(error)
        })
      );
      

  }
}
