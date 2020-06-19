import { BeforeLoginService } from './service/before-login.service';
import { RegistrationComponent } from './auth/registration/registration.component';
import { LoginComponent } from './auth/login/login.component';
import { BookManagementComponent } from './book-management/book-management.component';
import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { listLazyRoutes } from '@angular/compiler/src/aot/lazy_routes';
import { BookOneComponent } from './book-list/book-one/book-one.component';


const routes: Routes = [
   {path:'books', component:BookManagementComponent},
   {path:'book/:id',component:BookOneComponent},
   {path:'login', component:LoginComponent,canActivate:[BeforeLoginService]},
   {path:'signup',component:RegistrationComponent,canActivate:[BeforeLoginService]},
   {path:'',redirectTo:'books',pathMatch:'full'},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
