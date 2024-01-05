import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { concatMap } from 'rxjs/operators';
import { Book } from 'src/app/models/book';
import { BookService } from 'src/app/services/book/book.service';
import { ImageUploadService } from 'src/app/services/image-upload/image-upload.service';

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.css']
})
export class EditProductComponent implements OnInit {
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

  book!: Book;

  bookEditForm = new FormGroup({
    title: new FormControl(''),
    author: new FormControl(''),
    price: new FormControl(''),
    quantity: new FormControl(''),
    genre: new FormControl(''),
    description: new FormControl(''),
    bookcoverURL: new FormControl('')
  });

  constructor(
    private bookService: BookService,
    private imageUploadService: ImageUploadService,
    private toastr: ToastrService
  ) {}

  async ngOnInit(): Promise<void> {
    this.book = await this.bookService.getBook();
    this.bookEditForm.patchValue({
      title: this.book.title,
      author: this.book.author,
      price: this.book.price.toString(),
      quantity: this.book.quantity.toString(),
      genre: this.book.genre,
      description: this.book.description,
    });
  }

  updateBook() {
    const { title, author, price, quantity, genre, description} = this.bookEditForm.value;

    if (title && author && price && quantity && genre && description) {
      this.bookService
        .updateBook({
          bid: this.book.bid,
          title: title,
          author: author,
          price: parseFloat(price),
          quantity: parseFloat(price),
          genre: genre, 
          description: description,
          bookcoverURL: ''
        })
        .subscribe(
          () => {
            this.toastr.success('Book updated successfully!'); 
          },
          () => {
            this.toastr.error('There was an error in updating the book!');
          }
        );
    }
  }

  async uploadBookCover(event: any): Promise<void> {7
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
            bookcoverURL: photoURL
          })
        )
      )
      .subscribe(
        () => {
          console.log('Book cover uploaded successfully!');
          this.toastr.success('Cover uploaded successfully!'); 
        },
        (error) => {
          console.log('error')
          console.error('Error uploading book cover:', error);
          this.toastr.error('There was an error in uploading the cover!');
        }
      );
  }


}
