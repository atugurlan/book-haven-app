import { Injectable } from '@angular/core';
import { Cart } from 'src/app/models/cart';
import { Firestore, collection, deleteDoc, doc, getDocs, updateDoc } from '@angular/fire/firestore';
import { setDoc } from '@firebase/firestore';
import { Observable, from } from 'rxjs';
import { UserProfile } from '@angular/fire/auth';
import { CartItem } from 'src/app/models/cart-item';
import { UsersService } from '../users/users.service';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  cart!:Cart;
  user$ = this.usersService.currentUserProfile$;

  constructor(private firestore: Firestore,
              private usersService: UsersService) { }

  async getCart(): Promise<Cart> {
    return new Promise<Cart>((resolve, reject) => {
      this.user$.subscribe(async (user) => {
        if (user) {
          const cartCollection = collection(this.firestore, `shopping-cart/${user.uid}/items`);
          let cartItems: CartItem[] = [];
  
          await getDocs(cartCollection)
            .then((querySnapshot) => {
              querySnapshot.forEach((doc) => {
                const cartItem = doc.data() as CartItem;
                cartItems.push(cartItem);
              });
            })
            .then(() => {
              this.cart = {
                items: cartItems,
                totalPrice: this.calculateTotalPrice(cartItems)
              };
              resolve(this.cart);
            })
            .catch((error) => {
              reject(error);
            });
        }
      });
    });
  }
    
  calculateTotalPrice(items: CartItem[]): number {
    let totalPrice = 0;
    items.forEach(item => {
      totalPrice += item.price * item.quantity;
    });
    return totalPrice;
  }

  async removeFromCart(bookID: string): Promise<Cart> {
    return new Promise<Cart>((resolve, reject) => {
      this.user$.subscribe(async (user) => {
        if (user) {
          const cartCollection = collection(this.firestore, `shopping-cart/${user.uid}/items`);
          const querySnapshot = await getDocs(cartCollection);
      
          querySnapshot.forEach(async (doc) => {
            const cartItem = doc.data() as CartItem;
      
            if (cartItem.book.bid === bookID) {
              const docRef = doc.ref;
              await deleteDoc(docRef);
              // console.log('Item deleted');
  
              this.cart.items = this.cart.items.filter(item => item.book.bid !== bookID);
              // console.log(this.cart);
            }
          });
  
          resolve(this.cart); 
        } else {
          reject(new Error('User data not available.')); 
        }
      });
    });
  }

}
