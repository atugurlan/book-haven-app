import { Component, OnInit } from '@angular/core';
import { Book } from 'src/app/models/book';
import { BookService } from 'src/app/services/book/book.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  books:Book[] = [];

  constructor(private bookService: BookService) { }  

  async ngOnInit(): Promise<void> {
    this.books =  await this.bookService.allBooks();
  }

}
