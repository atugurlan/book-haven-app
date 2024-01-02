import { Injectable } from '@angular/core';
import { Firestore, collection, deleteDoc, getDocs } from '@angular/fire/firestore';
import { UsersService } from '../users/users.service';
import { Book } from 'src/app/models/book';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {
  wishlist!:Book[];
  user$ = this.usersService.currentUserProfile$;

  constructor(private firestore: Firestore,
    private usersService: UsersService) { }

  async getWishlist(): Promise<Book[]> {
    return new Promise<Book[]>((resolve) => {
      this.user$.subscribe(async (user) => {
        if (user) {
          const querySnapshot = getDocs(collection(this.firestore, `wishlist/${user.uid}/items`));
          let wishlistItems: Book[] = [];

          (await querySnapshot).forEach( (doc: { data: () => any; id: any; }) => {
            const book = doc.data() as Book;
            wishlistItems.push(book);
          })

          this.wishlist = wishlistItems

          resolve(this.wishlist);
        }
      });
    });
  }
  
  async removeFromWishlist(bookID: string): Promise<Book[]> {
    return new Promise<Book[]>((resolve, reject) => {
      this.user$.subscribe(async (user) => {
        if (user) {
          const cartCollection = collection(this.firestore, `wishlist/${user.uid}/items`);
          const querySnapshot = await getDocs(cartCollection);
      
          querySnapshot.forEach(async (doc) => {
            const book = doc.data() as Book;
      
            if (book.bid === bookID) {
              const docRef = doc.ref;
              await deleteDoc(docRef);
              
              this.wishlist = this.wishlist.filter(book => book.bid !== bookID);
            }
          });
          
          resolve(this.wishlist); 
        } else {
          reject(new Error('User data not available.')); 
        }
      });
    });
  }

}
