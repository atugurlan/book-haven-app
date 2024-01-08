import { Component } from '@angular/core';
import { Book } from 'src/app/models/book';
import { BookService } from 'src/app/services/book/book.service';
import {  ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-set-discounts',
  templateUrl: './set-discounts.component.html',
  styleUrls: ['./set-discounts.component.css']
})
export class SetDiscountsComponent {
  discountReason: string = '';
  discountPercentage: number = 0;
  books: Book[] = [];
  originalPrices: { [key: string]: number } = {};

  constructor(private bookService: BookService, private toastr: ToastrService) {
    this.fetchBooks();
  }

  async fetchBooks() {
    try {
      this.books = await this.bookService.allBooks();
      this.saveOriginalPrices();
    } catch (error) {
      console.error('Error fetching books:', error);
    }
  }

  saveOriginalPrices() {
    this.books.forEach(book => {
      this.originalPrices[book.bid] = book.price;
    });
  }

  applyDiscounts() {
    this.books.forEach(book => {
      const discountedPrice = book.price - (book.price * (this.discountPercentage / 100));
      book.price = discountedPrice;
    });

    this.toastr.success('Discounts applied successfully!');
  }

  removeDiscounts() {
    this.books.forEach(book => {
      if (this.originalPrices[book.bid]) {
        book.price = this.originalPrices[book.bid];
      }
    });

    this.toastr.success('Discounts removed successfully!');
  }
}