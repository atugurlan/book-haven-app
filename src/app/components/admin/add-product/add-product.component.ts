import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { concatMap } from 'rxjs';
import { BookService } from 'src/app/services/book/book.service';
import { Book } from 'src/app/models/book';
import { ImageUploadService } from 'src/app/services/image-upload/image-upload.service';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css']
})
export class AddProductComponent {
  productForm = new FormGroup({
    bid: new FormControl(''),
    title: new FormControl(''),
    author: new FormControl(''),
    price: new FormControl(''),
    quantity: new FormControl(''),
    genre: new FormControl(''),
    description: new FormControl('')
  });

  bookDetailsSubmitted: boolean = false;

  bookGenre: string[] = [
    'Fiction',
    'Non-fiction',
    'Mystery',
    'Thriller',
    'Romance',
    'Fantasy',
    'Biography',
    'Autobiography',
    'History',
    'Horror',
    'Poetry',
    'Cookbooks'
  ];

  imageURL: any;

  constructor(
    private toastr: ToastrService,
    private bookService: BookService, 
    private imageUploadService: ImageUploadService
  ) {}

  async saveBookDetails() {
    const { bid, title, author, price, quantity, genre, description } = this.productForm.value;

    if (!title) {
      return;
    }

    if (bid && title && author && price && quantity && genre && description) {
      this.bookService.addBook({
        bid,
        title,
        author,
        price: parseFloat(price),
        quantity: parseFloat(quantity),
        genre,
        description,
        //id: await this.bookService.getNumberOfBooks() + 1,
        bookcoverURL: ''
      })
      .subscribe(
        () => {
          this.toastr.success('Book saved successfully!');
        },
        () => {
          this.toastr.error('There was an error in adding the book!'); 
        }
      );
    }
    this.bookDetailsSubmitted = true;
  }

  async uploadBookCover(event: any): Promise<void> {
    let book = await this.bookService.getLastBook();
    
    this.imageUploadService
      .uploadImage(event.target.files[0], `images/books/${book.title}`)
      .pipe(
        concatMap((photoURL) =>
          this.bookService.updateBook({
            bid: book.bid,
            title: book.title,
            author: book.author,
            price: book.price,
            quantity: book.quantity,
            genre: book.genre,
            description: book.description,
            bookcoverURL: book.bookcoverURL
          })
        )
      )
      .subscribe(
        () => {
          this.toastr.success('Cover uploaded successfully!'); 
        },
        () => {
          this.toastr.error('There was an error in uploading the cover!');
        }
      );
  }


}


