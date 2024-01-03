import { Component, Input } from '@angular/core';
import { Tag } from 'src/app/models/tags';
import { BookService } from 'src/app/services/book/book.service';

@Component({
  selector: 'app-tags',
  templateUrl: './tags.component.html',
  styleUrls: ['./tags.component.css']
})
export class TagsComponent {
  @Input()
  bookTags?:string;
  tags?:Tag[];

  constructor(private bookService:BookService) { }

  async ngOnInit(): Promise<void> {
    if(!this.bookTags)
     this.tags = await this.bookService.countGenres();
  }
}
