import { Injectable } from '@angular/core';
import { Firestore, collection, deleteDoc, getDocs } from '@angular/fire/firestore';
import { UsersService } from '../users/users.service';
import { Book } from 'src/app/models/book';
import { Wishlist } from 'src/app/models/wishlist';
import { WishlistItem } from 'src/app/models/wishlist-item';
import { ProfileUser } from 'src/app/models/user-profile';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {
  wishlist!:Wishlist;
  user$ = this.usersService.currentUserProfile$;

  constructor(private firestore: Firestore,
    private usersService: UsersService) { }

  async getWishlist(): Promise<Wishlist> {
    return new Promise<Wishlist>((resolve) => {
      this.user$.subscribe(async (user) => {
        if (user) {
          const querySnapshot = getDocs(collection(this.firestore, `wishlist/${user.uid}/items`));
          let wishlistItems: WishlistItem[] = [];

          (await querySnapshot).forEach( (doc: { data: () => any; id: any; }) => {
            const book = doc.data() as WishlistItem;
            wishlistItems.push(book);
          })

          this.wishlist = {
            items: wishlistItems
          }

          resolve(this.wishlist);
        }
      });
    });
  }
  
  async removeFromWishlist(userId: string, bookID: string): Promise<Wishlist> {
    console.log('removing')
    const wishlistCollection = collection(this.firestore, `wishlist/${userId}/items`);
    const querySnapshot = await getDocs(wishlistCollection);
      
    querySnapshot.forEach(async (doc) => {
      const wishlistItem = doc.data() as WishlistItem;
  
      if (wishlistItem.book.bid === bookID) {
        const docRef = doc.ref;
        await deleteDoc(docRef);
  
        this.wishlist.items = this.wishlist.items.filter(item => item.book.bid !== bookID);
      }
    });
  
    return this.wishlist;
  }
}
