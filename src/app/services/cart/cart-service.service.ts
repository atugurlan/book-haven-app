import { Injectable } from '@angular/core';
import { Cart } from 'src/app/models/cart';
import { Firestore, addDoc, collection, deleteDoc, doc, getDocs, updateDoc } from '@angular/fire/firestore';
import { setDoc } from '@firebase/firestore';
import { Observable, from } from 'rxjs';
import { UserProfile } from '@angular/fire/auth';
import { CartItem } from 'src/app/models/cart-item';
import { UsersService } from '../users/users.service';
import { DocumentReference, DocumentData } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  cart!:Cart;
  user$ = this.usersService.currentUserProfile$;

  constructor(private firestore: Firestore,
              private usersService: UsersService) { }

  async getCart(): Promise<Cart> {
    return new Promise<Cart>((resolve) => {
      this.user$.subscribe(async (user) => {
        if (user) {
          const querySnapshot = getDocs(collection(this.firestore, `shopping-cart/${user.uid}/items`));
          let cartItems: CartItem[] = [];

          (await querySnapshot).forEach( (doc: { data: () => any; id: any; }) => {
            const cartItem = doc.data() as CartItem;
            cartItems.push(cartItem);
          })

          this.cart = {
            items: cartItems,
            totalPrice: this.calculateTotalPrice(cartItems)
          };
          resolve(this.cart);
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
  
              this.cart.items = this.cart.items.filter(item => item.book.bid !== bookID);
            }
          });
  
          resolve(this.cart); 
        } else {
          reject(new Error('User data not available.')); 
        }
      });
    });
  }

  async changeQuantity(bookId: string, quantity: number): Promise<Cart> {
    return new Promise<Cart>((resolve, reject) => {
      this.user$.subscribe(async (user) => {
        if (user) {
          const cartCollection = collection(this.firestore, `shopping-cart/${user.uid}/items`);
          const querySnapshot = await getDocs(cartCollection);
    
          querySnapshot.forEach(async (doc) => {
            const cartItem = doc.data() as CartItem;
    
            if (cartItem.book.bid === bookId) {
              const docRef = doc.ref;
    
              await updateDoc(docRef, { quantity: quantity });
              console.log('Quantity updated in Firestore for item with ID:', bookId, 'New quantity:', quantity);
    
              let foundItem = this.cart.items.find(item => item.book.bid === bookId);
              if (foundItem) {
                foundItem.quantity = quantity;
                console.log('Local cart updated with new quantity:', this.cart);
              }
            }
          });
    
          const updatedCart = await this.fetchUpdatedCart(user.uid);
          this.cart = updatedCart;
          resolve(this.cart);
        } else {
          reject(new Error('User data not available.'));
        }
      });
    });
  }
  
  async fetchUpdatedCart(userId: string): Promise<Cart> {
    const cartCollection = collection(this.firestore, `shopping-cart/${userId}/items`);
    const querySnapshot = await getDocs(cartCollection);
    
    let totalPrice = 0;
    const items: CartItem[] = [];
    
    querySnapshot.forEach(doc => {
      const cartItem = doc.data() as CartItem;
      totalPrice += cartItem.price * cartItem.quantity;
      items.push(cartItem);
    });

    console.log('Compute new price' + totalPrice);
    
    return { items, totalPrice };
  }
}