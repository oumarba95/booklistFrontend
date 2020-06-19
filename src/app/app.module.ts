import { AppInterceptorService } from './service/app-interceptor.service';
import { BrowserModule, Title } from '@angular/platform-browser';
import { NgModule, LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BookListComponent } from './book-list/book-list.component';
import { BookOneComponent } from './book-list/book-one/book-one.component';
import { BookFormComponent } from './book-list/book-form/book-form.component';
import { BookManagementComponent } from './book-management/book-management.component';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from './header/header.component';
import { HttpClientModule } from '@angular/common/http';
import { BookService } from './service/book.service';
import { BookSingleComponent } from './list-book/book-single/book-single.component';
import { MyLoaderComponent } from './my-loader/my-loader.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { CommentaireComponent } from './commentaire/commentaire.component';
import { LoginComponent } from './auth/login/login.component';
import { RegistrationComponent } from './auth/registration/registration.component';



registerLocaleData(localeFr, 'fr');
@NgModule({
  declarations: [
    AppComponent,
    BookListComponent,
    BookOneComponent,
    BookFormComponent,
    BookManagementComponent,
    HeaderComponent,
    BookSingleComponent,
    MyLoaderComponent,
    CommentaireComponent,
    LoginComponent,
    RegistrationComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [
    BookService,
    {provide: LOCALE_ID, useValue: 'fr' },
    {
      provide:HTTP_INTERCEPTORS,
      useClass:AppInterceptorService,
      multi:true
    },
    Title
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
