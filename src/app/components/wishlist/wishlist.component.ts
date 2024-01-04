import { Component, OnInit } from '@angular/core';
import { Subscription, interval, take } from 'rxjs';
import { Book } from 'src/app/models/book';
import { Wishlist } from 'src/app/models/wishlist';
import { WishlistItem } from 'src/app/models/wishlist-item';
import { BookService } from 'src/app/services/book/book.service';
import { UsersService } from 'src/app/services/users/users.service';
import { WishlistService } from 'src/app/services/wishlist/wishlist.service';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.css']
})
export class WishlistComponent implements OnInit {
  wishlist!: Wishlist;
  books!: Book[];
  user$ = this.usersService.currentUserProfile$;
  userid!:string;
  private userSubscription!: Subscription;

  constructor(private wishlistService: WishlistService,
              private bookService: BookService,
              private usersService: UsersService) {}

  async ngOnInit(): Promise<void> {
    this.userSubscription = this.user$.subscribe(user => {
      if(user) {
        this.userid = user?.uid;
        console.log(this.userid)
      }
    });
    this.wishlist = await this.wishlistService.getWishlist();
  }

  ngOnDestroy(): void {
    this.userSubscription.unsubscribe();
  }

  async setWishlist() {
    this.wishlist = await this.wishlistService.getWishlist();
  }

  addToCart(book: WishlistItem) {
    console.log('add item to shopping cart')
    this.bookService.addBookTo(this.userid, book.book, 'shopping-cart')
    this.removeFromWishlist(book)
  }

  async removeFromWishlist(book: WishlistItem) {
    console.log('removed item from wishlist')
    this.wishlist = await this.wishlistService.removeFromWishlist(this.userid, book.book.bid)
  }

  async checkAvailability(wish_book:WishlistItem):Promise<boolean> {
    this.books = await this.bookService.allBooks()
    const book = this.books.find((b) => b.bid === wish_book.book.bid) || null;

    if (book) {
      if(book.quantity == 0) {
        return false
      }
    }

    return true
  }

}
