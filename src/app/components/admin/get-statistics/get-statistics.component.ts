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
      const bookId = wishlistItem.book.bid;
      wishlistCountMap.set(bookId, (wishlistCountMap.get(bookId) || 0) + 1);
    });

    // Convert map to an array of objects for sorting
    const wishlistCountArray = Array.from(wishlistCountMap, ([bookId, count]) => ({ bookId, count }));

    // Sort the wishlistCountArray by count in descending order
    wishlistCountArray.sort((a, b) => b.count - a.count);

    // Assign the sorted wishlistCountArray to mostWishlistAddedBooks
    this.mostWishlistAddedBooks = wishlistCountArray;
  }

  async getTopRatedBooks(): Promise<void> {
    try {
      const allReviews = await this.reviewService.allReviews();
  
      const reviewsByBookId: { [key: string]: Review[] } = {};
  
      allReviews.forEach((review) => {
        const bookId = review.bid || 'unknown';
        if (!reviewsByBookId[bookId]) {
          reviewsByBookId[bookId] = [];
        }
        reviewsByBookId[bookId].push(review);
      });
  
      const bookIds = Object.keys(reviewsByBookId);
      const topRatedBooks: { bookId: string, averageRating: number }[] = [];
  
      for (const bookId of bookIds) {
        const reviewsForBook = reviewsByBookId[bookId];
        const averageRating = await this.reviewService.averageStar(reviewsForBook || []);
        topRatedBooks.push({ bookId, averageRating });
      }
  
      // Sort topRatedBooks by averageRating in descending order
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
