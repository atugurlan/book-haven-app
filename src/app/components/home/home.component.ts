import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Book } from 'src/app/models/book';
import { BookService } from 'src/app/services/book/book.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  books:Book[] = [];

  constructor(private bookService: BookService,
              private route: ActivatedRoute,
              private router: Router) { }  

  async ngOnInit(): Promise<void> {
    this.route.params.subscribe( async params => {
      const searchTerm = params['searchTerm'];
      const genreTerm = params['genre']
      console.log(genreTerm)

      if(searchTerm)
        this.books = await this.bookService.getAllBooksBySearchTerm(searchTerm);
      else if(genreTerm)
        this.books = await this.bookService.getBooksByGenre(genreTerm)
      else
        this.books =  await this.bookService.allBooks();
    });
  }

}
