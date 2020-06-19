import { SearchService } from './../service/search.service';
import { Subject } from 'rxjs';
import { AuthStatusService } from './../auth-status.service';
import { BookService } from './../service/book.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-book-management',
  templateUrl: './book-management.component.html',
  styleUrls: ['./book-management.component.css']
})
export class BookManagementComponent implements OnInit {
  search;
  constructor(private searchServ:SearchService) { }

  ngOnInit(): void {
  }
  searchEvent(){
    this.searchServ.searchSub.next(this.search);
  }
}
