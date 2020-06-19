import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders} from '@angular/common/http';
import { Book } from '../Model/book.model';
import { Observable,Subject} from 'rxjs';
import {tap} from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class BookService {
  server:string = 'http://localhost:8000/api/';
  headers=new HttpHeaders();
  token;
  private _subject = new Subject<any>();
  constructor(private http:HttpClient) { 
   
      this.token = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
      this.headers.set('Content-Type', 'application/json; charset=utf-8');
      this.headers.set('X-CSRF-TOKEN',this.token);

  }
  
  get subject(){
    return this._subject;
  }
  getAllBooks(status):Observable<Book[]>{
    console.log(this.server+'books?status='+status);
      return this.http.get<Book[]>(this.server+'books?status='+status);
      
  }
  addBook(book:FormData):Observable<Book>{
     return this.http.post<Book>(this.server+'book',book).pipe(
       tap(()=> this._subject.next())
     );
  }
  addComment(comment){
    return this.http.post(this.server+'addComment',comment);
  }
  addanswer(answer){
    return this.http.post(this.server+'addAnswer',answer);
  }
  getOneBook(id:number):Observable<Book>{
    return this.http.get<Book>(this.server+'book/'+id);
  }
  removeBook(id:number):Observable<Book> {
    return this.http.delete<Book>(this.server+'book/'+id).pipe(
      tap(()=>{
        this._subject.next();
      })
    );
  }
  getBookPaginate(id){
    return this.http.get(this.server+'books?page='+id+'&status=withPagination');
  }
  likeComment(like){
     return this.http.post(this.server+'likeComment',like);
  }
  dislikeComment(dislike){
    return this.http.post(this.server+'dislikeComment',dislike);
 }
 likeAnswer(like){
  return this.http.post(this.server+'likeAnswer',like);
}
dislikeAnswer(dislike){
  return this.http.post(this.server+'dislikeAnswer',dislike);
}
}
