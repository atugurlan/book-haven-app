import { Component } from '@angular/core';
import { Firestore, collection, doc, setDoc } from '@angular/fire/firestore';
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
  reviewMessage: string = '';
  selectedStarRating: number | null= null;
  reviewSubmitted!: boolean

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
          this.reviewSubmitted = this.hasSubmittedReview()
        }
        else {
          console.error("Book with bid ${params['id']} not found")
        }
      }
    })
  }

  async addToCart(book:Book) {
    this.user$.subscribe(async (user) => {
      if (user) {
        await this.bookService.addBookTo(user, book, 'shopping-cart')
      } else {
        console.error('User data not available.');
      }
    });
  }

  async addToWishlist(book:Book) {
    this.user$.subscribe(async (user) => {
      if (user) {
        await this.bookService.addBookTo(user, book, 'wishlist')
      } else {
        console.error('User data not available.');
      }
    });
  }

  hasSubmittedReview() {
    this.user$.subscribe(async (user) => {
      if (user) {
        return this.reviews.some((review) => review.uid === user.uid);
      } else {
        console.error('User data not available.');
        return false
      }
    });
    return false
  }

  async addReview() {
    if (this.selectedStarRating !== null && this.reviewMessage.trim() !== '') {
      this.user$.subscribe(async (user) => {
        if (user && user.firstName && user.lastName) {
          let all_reviews = await this.reviewService.allReviews()
          let id = all_reviews.length + 1
          let review = {
            rid: id.toString(),
            bid: this.book.bid,
            name: user.firstName + ' ' + user.lastName[0],
            uid: user.uid,
            review: this.reviewMessage,
            stars: this.selectedStarRating || undefined
          }
          this.reviewService.addReview(review)
  
          this.reviews = await this.reviewService.allReviewsForBook(this.book.bid);
          console.log(`Added review with ${this.selectedStarRating} stars and message: ${this.reviewMessage}`);
          
          this.selectedStarRating = null;
          this.reviewMessage = '';
        } else {
          console.error('User data not available.');
        }
      });
    } else {
      console.error('Star rating and review message are required.');
    }
  }

}
