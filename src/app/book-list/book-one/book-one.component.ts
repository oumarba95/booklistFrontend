import { AuthService } from './../../service/auth.service';
import { AuthStatusService } from './../../auth-status.service';
import { LoaderService } from './../../service/loader.service';
import { BookService } from './../../service/book.service';
import { Component, OnInit } from '@angular/core';
import { Book } from 'src/app/Model/book.model';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-book-one',
  templateUrl: './book-one.component.html',
  styleUrls: ['./book-one.component.css']
})
export class BookOneComponent implements OnInit {
  book:Book;
  loading:boolean = true;
  user_id = + sessionStorage.getItem('user_id');
  redirectLogi;
  contenu=null;
  directory:string = 'http://localhost:8000/images/';
  loggedIn ;;
  constructor(private bookService:BookService,private route:ActivatedRoute,
    private loadS:LoaderService,private auth:AuthService,private authS:AuthStatusService,private router:Router) {

     }

  ngOnInit(): void {
    
    this.getBook();
    this.authS.loggedInObs.subscribe(
      (data) => {
        this.loggedIn = data;
        console.log(data);
      }
    )
 
  }
  getBook(){
    const id = this.route.snapshot.params['id'];
    this.bookService.getOneBook(+id).subscribe(
      (book:any)=>{
        this.book = book.data;
        this.loading = false;
    })
  }
  addComment(e,f){
    const text = e.target.textContent ;
    e.target.textContent = 'Patienter...';
    console.log(this.user_id);
    const comment = {
       user_id:this.user_id,
       book_id:this.book.id,
       contenu:this.contenu
    };
    this.bookService.addComment(comment).subscribe(
      (comment:any) =>{
       this.book.comments.push(comment.data);
       f.reset();
       e.target.textContent = text;
    },
    (error) => e.target.textContent = text
      )
  }

redirectLogin(e){
  e.preventDefault();
  this.router.navigateByUrl(`/login?from=${this.router.url}`);
}
}
