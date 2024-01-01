import { Component } from '@angular/core';
import { Firestore, doc, setDoc } from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';
import { Book } from 'src/app/models/book';
import { CartItem } from 'src/app/models/cart-item';
import { Review } from 'src/app/models/reviews';
import { ProfileUser } from 'src/app/models/user-profile';
import { BookService } from 'src/app/services/book/book.service';
import { ReviewService } from 'src/app/services/review/review.service';
import { UsersService } from 'src/app/services/users/users.service';

@Component({
  selector: 'app-book-page',
  templateUrl: './book-page.component.html',
  styleUrls: ['./book-page.component.css']
})
export class BookPageComponent {
  book!:Book;
  reviews!:Review[];
  stars_average!:number;
  stars_percentage!:number[];
  user$ = this.usersService.currentUserProfile$;

  constructor(private activatedRoute: ActivatedRoute,
              private bookService: BookService,
              private reviewService: ReviewService,
              private usersService: UsersService,
              private firestore: Firestore) { }

  async ngOnInit(): Promise<void> {
    this.activatedRoute.params.subscribe(async (params) => {
      if(params['bid']) {
        const book = await this.bookService.getBookByBID(params['bid']);
        const reviews = await this.reviewService.allReviewsForBook(params['bid']);

        if(book) {
          this.book = book;
          this.reviews = reviews;
          this.stars_average = await this.reviewService.averageStar(reviews);
          this.stars_percentage = await this.reviewService.percentageStar(reviews);
        }
        else {
          console.error("Book with bid ${params['id']} not found")
        }
      }
    })
  }

  async addToCart(book:Book) {
    let currentUser: ProfileUser | null = null;

    this.user$.subscribe(async (user) => {
      if (user) {
        try {
          currentUser = user;
          const cartItem: CartItem = {
            book: book,
            price: book.price,
            quantity: 1
          }
          const cartDoc = doc(this.firestore,`shopping-cart/${user.uid}/items/${book.bid}`);
          await setDoc(cartDoc, cartItem);
          console.log('Book item added to the cart successfully!');
        }catch (error) {
          console.error('Error adding book item to the cart:', error);
        }
      } else {
        console.error('User data not available.');
      }
    });
  }


}
