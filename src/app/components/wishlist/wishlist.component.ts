import { Component, OnInit } from '@angular/core';
import { Book } from 'src/app/models/book';
import { BookService } from 'src/app/services/book/book.service';
import { UsersService } from 'src/app/services/users/users.service';
import { WishlistService } from 'src/app/services/wishlist/wishlist.service';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.css']
})
export class WishlistComponent implements OnInit {
  wishlist!: Book[];
  books!: Book[];
  user$ = this.usersService.currentUserProfile$;

  constructor(private wishlistService: WishlistService,
              private bookService: BookService,
              private usersService: UsersService) {}

  async ngOnInit(): Promise<void> {
    this.wishlist = await this.wishlistService.getWishlist();
  }

  async setWishlist() {
    this.wishlist = await this.wishlistService.getWishlist();
  }

  async addToCart(book:Book) {
    this.user$.subscribe(async (user) => {
      if (user) {
        await this.bookService.addBookTo(user, book, 'shopping-cart')
        this.wishlist = await this.wishlistService.removeFromWishlist(book.bid)
        this.setWishlist()
      } else {
        console.error('User data not available.');
      }
    });
  }

  async removeFromWishlist(book:Book) {
    this.user$.subscribe(async (user) => {
      if (user) {
        this.wishlist = await this.wishlistService.removeFromWishlist(book.bid)
        this.setWishlist()
      } else {
        console.error('User data not available.');
      }
    });
  }

  async checkAvailability(wish_book:Book):Promise<boolean> {
    this.books = await this.bookService.allBooks()
    const book = this.books.find((b) => b.bid === wish_book.bid) || null;

    if (book) {
      if(book.quantity == 0) {
        return false
      }
    }

    return true
  }

}
