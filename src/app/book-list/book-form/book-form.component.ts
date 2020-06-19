import { BookService } from './../../service/book.service';
import { Component, OnInit } from '@angular/core';
import { Book } from 'src/app/Model/book.model';
import { Form, NgForm } from '@angular/forms';

@Component({
  selector: 'app-book-form',
  templateUrl: './book-form.component.html',
  styleUrls: ['./book-form.component.css']
})
export class BookFormComponent implements OnInit {
  titre:string;
  auteur:string;
  image:File;
  description:string;
  isSubmitted:boolean=false;
  constructor(private bookService:BookService) { }

  ngOnInit(): void {
  }
  assignImage(e){
     this.image = e.target.files[0];
     
  }
  addBook(form:NgForm){
    this.isSubmitted = true;
    if(form.valid){
    const formData = new FormData();
    formData.append('titre',this.titre);
    formData.append('auteur',this.auteur);
    formData.append('image',this.image,this.image.name);
    formData.append('description',this.description);
    this.bookService.addBook(formData).subscribe(
      (book:Book)=>{
        this.bookService.subject.next(book);
      }
    );
    this.resetForm(form);
    }else console.log('formulaire non valide');
    
  }
  resetForm(form:NgForm){
    form.reset();
    this.resetFile();
    this.isSubmitted = false;
  }
  resetFile(){
    const file = <HTMLInputElement>document.getElementById('file');
    file.value = ''
  }

}
