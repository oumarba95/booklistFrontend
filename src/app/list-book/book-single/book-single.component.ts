import { BookService } from './../../service/book.service';
import { Component, OnInit,Input } from '@angular/core';
import { Book } from 'src/app/Model/book.model';

@Component({
  selector: 'app-book-single',
  templateUrl: './book-single.component.html',
  styleUrls: ['./book-single.component.css']
})
export class BookSingleComponent implements OnInit {
  @Input() book:Book;
  supLoading:boolean = false;
  directory:string = "http://localhost:8000/images/";
  constructor(private bookService:BookService) { }

  ngOnInit(): void {
  }
  removeBook(id:number){
    this.supLoading = true;
    this.bookService.removeBook(id).subscribe((book:Book)=>{
        //flash messag
    })
    
  }
}
