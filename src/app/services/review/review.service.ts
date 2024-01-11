import { Injectable } from '@angular/core';
import { Firestore, collection, doc, getDocs, query, where } from '@angular/fire/firestore';
import { Observable, count, filter, from } from 'rxjs';
import { setDoc } from '@firebase/firestore';
import { Review } from 'src/app/models/reviews';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {

  constructor(private firestore: Firestore) { }

  addReview(review: Review) : Observable<any> {
    const ref = doc(this.firestore, 'reviews', review?.rid);
    return from(setDoc(ref, review));
  }

  async allReviews():Promise<Review[]> {
    const reviews:Review[] = [];

    const querySnapshot = getDocs(collection(this.firestore, "reviews"));

    (await querySnapshot).forEach( (doc: { data: () => any; id: any; }) => {
      const reviewData: any = doc.data(); 
      const review: Review = {
        rid: doc.id,
        uid: reviewData.uid,
        bid: reviewData.bid,
        title: reviewData.title,
        name: reviewData.name,
        stars: reviewData.stars,
        review: reviewData.review
      }
      reviews.push(review);
    });
    return reviews;
  }

  async allReviewsForBook(bookId: string): Promise<Review[]> {
    const reviews: Review[] = await this.allReviews();
    const filter_reviews = reviews.filter((review) => review.bid == bookId);
    return filter_reviews;
  }

  async averageStar(reviews: Review[]):Promise<number> {
    if(!reviews || reviews.length == 0)
      return 0;
    
    const sum = reviews.reduce( (sum, review) => {
      if (typeof review.stars === 'number') {
        return sum + review.stars;
      } 
      else {
        return sum;
      }
    }, 0);
    const average = sum / reviews.length;

    return average;
  }

  async percentageStar(reviews: Review[]):Promise<number[]> {
    if(!reviews || reviews.length == 0)
      return [0, 0, 0, 0, 0]

    const countStars = [0, 0, 0, 0, 0];
    reviews.forEach((review) => {
      if(review.stars)
        countStars[review.stars - 1]++;
    });
    
    const percentages = countStars.map((count) => count/reviews.length * 100);
    return percentages
  }
}
