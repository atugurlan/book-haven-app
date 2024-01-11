import { Component, OnInit } from '@angular/core';
import { OrderService } from 'src/app/services/order/order.service';
import { WishlistService } from 'src/app/services/wishlist/wishlist.service';
import { ReviewService } from 'src/app/services/review/review.service';
import { Review } from 'src/app/models/reviews';
import { Book } from 'src/app/models/book';
import { BookService } from 'src/app/services/book/book.service';

@Component({
  selector: 'app-get-statistics',
  templateUrl: './get-statistics.component.html',
  styleUrls: ['./get-statistics.component.css']
})
export class GetStatisticsComponent implements OnInit {
  mostOrderedBooks: any[] = [];
  mostWishlistAddedBooks: any[] = [];
  topRatedBooks: any[] = [];
  outOfStockBooks: Book[] = [];

  constructor(
    private orderService: OrderService,
    private wishlistService: WishlistService,
    private reviewService: ReviewService,
    private bookService: BookService
  ) {}

  ngOnInit(): void {
    this.getMostOrderedBooks();
    this.getMostWishlistAddedBooks();
    this.getTopRatedBooks();
    this.getOutOfStockBooks();
  }

  async getMostOrderedBooks(): Promise<void> {
    try {
      this.mostOrderedBooks = await this.orderService.getMostOrderedBooks();
      console.log('Most ordered books:', this.mostOrderedBooks);
    } catch (error) {
      console.error('Error fetching most ordered books:', error);
    }
  }

  async getMostWishlistAddedBooks(): Promise<void> {
    const wishlist = await this.wishlistService.getWishlist();
    const wishlistCountMap = new Map<string, number>();

    wishlist.items.forEach((wishlistItem) => {
      const bookTitle = wishlistItem.book.title;
      wishlistCountMap.set(bookTitle, (wishlistCountMap.get(bookTitle) || 0) + 1);
    });

    console.log(wishlistCountMap);

    const wishlistCountArray = Array.from(wishlistCountMap, ([bookTitle, count]) => ({ bookTitle, count }));

    wishlistCountArray.sort((a, b) => b.count - a.count);

    this.mostWishlistAddedBooks = wishlistCountArray;
  }

  async getTopRatedBooks(): Promise<void> {
    try {
      const allReviews = await this.reviewService.allReviews();
  
      const reviewsByBookTitle: { [key: string]: Review[] } = {};
  
      allReviews.forEach((review) => {
        const bookTitle = review.title || 'unknown';
        if (!reviewsByBookTitle[bookTitle]) {
          reviewsByBookTitle[bookTitle] = [];
        }
        reviewsByBookTitle[bookTitle].push(review);
      });

      console.log(reviewsByBookTitle)
  
      const bookTitles = Object.keys(reviewsByBookTitle);
      const topRatedBooks: { bookId: string, averageRating: number }[] = [];
  
      for (const bookId of bookTitles) {
        const reviewsForBook = reviewsByBookTitle[bookId];
        const averageRating = await this.reviewService.averageStar(reviewsForBook || []);
        topRatedBooks.push({ bookId, averageRating });
      }
  
      topRatedBooks.sort((a, b) => b.averageRating - a.averageRating);
  
      this.topRatedBooks = topRatedBooks;
    } catch (error) {
      console.error('Error fetching top rated books:', error);
    }
  }
  
  async getOutOfStockBooks(): Promise<void> {
    try {
      this.outOfStockBooks = await this.bookService.getOutOfStockBooks();
      console.log('Out of Stock Books:', this.outOfStockBooks);
    } catch (error) {
      console.error('Error fetching out of stock books:', error);
    }
  }
  
}
