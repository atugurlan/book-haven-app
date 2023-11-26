import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Book } from 'src/app/models/book';
import { BookService } from 'src/app/services/book/book.service';

@Component({
  selector: 'app-book-page',
  templateUrl: './book-page.component.html',
  styleUrls: ['./book-page.component.css']
})
export class BookPageComponent {
  book!:Book;

  constructor(private activatedRoute: ActivatedRoute,
              private bookService: BookService) { }

  async ngOnInit(): Promise<void> {
    this.activatedRoute.params.subscribe(async (params) => {
      if(params['bid']) {
        const book = await this.bookService.getBookByBID(params['bid']);

        if(book) {
          this.book = book;
        }
        else {
          console.error("Book with bid ${params['id']} not found")
        }
      }
    })
  }
}
