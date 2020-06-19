import { SearchService } from './../service/search.service';
import { AuthService } from './../service/auth.service';
import { LoaderService } from './../service/loader.service';
import { Book } from './../Model/book.model';
import { Component, OnInit, Input } from '@angular/core';
import { BookService } from '../service/book.service';
import { empty } from 'rxjs';

@Component({
  selector: 'app-book-list',
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.css']
})
export class BookListComponent implements OnInit {
  books = [];
  @Input() search;
  BooksPrev;
  totalBooks;
  paginationConfig = {
    total_page : null,
    next_page : null,
  };
  loading:boolean = true;
  supLoading:boolean = false;
  loadFull = false;
  loadMoreLoading=null;
  constructor(private bookService:BookService,private auth:AuthService,private searchServ:SearchService) { }

  ngOnInit(): void {
    this.bookService.subject.subscribe(
      () => this.getbooks('')
      )
    this.getbooks('withPagination');
    this.searchServ.searchSub.subscribe(
      (data) => {
        if(data){
          this.searchResult(data);
          this.loadFull = true;
        }
        else
          this.books = this.totalBooks; 
      }
    )
  }
  getbooks(withPagination){
     this.bookService.getAllBooks(withPagination).subscribe(
       (books:any)=>{
         if(withPagination ==''){
            this.books = books.data;
            this.totalBooks = books.data;
            this.loadFull = true;
            return true;
         }
         this.books = books.data;
         this.bookService.getAllBooks('').subscribe(
           (dat:any) => this.totalBooks = dat.data
         )
         
         this.paginationConfig.total_page = books.meta.total/books.meta.per_page;
         if(this.paginationConfig.total_page <= 1) 
              this.loadFull = true;
         else 
            this.loadFull = false;
         this.paginationConfig.next_page = 2;
         this.loading = false;
        }
     ) 
  }
  loadMore(){
    this.loadMoreLoading = true;
    const next_page = this.paginationConfig.next_page;
        this.bookService.getBookPaginate(next_page).subscribe(
           (data:any) => {
             const booksPlus = this.books.concat(data.data);
             this.books = booksPlus;
             this.loadMoreLoading = false;
             this.paginationConfig.next_page++;
             if(this.paginationConfig.next_page > this.paginationConfig.total_page)
                this.loadFull=true;
             else
               this.loadFull = false;
         }
      );
  }
  searchResult(data){
    var realData = data.replace(/[\s]{2,}/g," ");
    realData = realData.replace(/[\s]{1,}$/,"");
    realData = realData.replace(/^[\s]{1,}/,"");
    console.log(realData)
    const inf = new RegExp(realData,'i');
    var results = this.totalBooks.filter(
      (book) => book.titre.search(inf) > -1 
    )
    this.books = results ;
  }
 
}
