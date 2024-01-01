import { Component, OnInit } from '@angular/core';
import { Firestore, doc, setDoc } from '@angular/fire/firestore';
import { Subscription, from, interval } from 'rxjs';
import { Book } from 'src/app/models/book';
import { Cart } from 'src/app/models/cart';
import { CartItem } from 'src/app/models/cart-item';
import { Order } from 'src/app/models/order';
import { ProfileUser } from 'src/app/models/user-profile';
import { BookService } from 'src/app/services/book/book.service';
import { CartService } from 'src/app/services/cart/cart-service.service';
import { OrderService } from 'src/app/services/order/order.service';
import { UsersService } from 'src/app/services/users/users.service';

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.css']
})
export class ShoppingCartComponent implements OnInit {
  cart!:Cart;
  cartItems!:CartItem[];
  orders!:Order[];
  books!:Book[];
  private updateSubscription: Subscription;

  user$ = this.usersService.currentUserProfile$;

  constructor(private usersService: UsersService,
              private cartService: CartService,
              private firestore: Firestore,
              private ordersService: OrderService,
              private bookService: BookService) {
                this.updateSubscription = interval(5000).subscribe(() => {
                  this.checkQuantity();
                });
              }
  
  async ngOnInit(): Promise<void> {
    this.cart = await this.cartService.getCart();
    this.cartItems = this.cart.items || [];
    this.books = await this.bookService.allBooks()
  }

  ngOnDestroy(): void {
    this.updateSubscription.unsubscribe();
  }

  async setCart() {
    this.cart = await this.cartService.getCart();
  }

  async checkQuantity() {
    this.books = await this.bookService.allBooks()

    let newCartItems:CartItem[] = [];

    for (const cartItem of this.cartItems) {
      const book = this.books.find((b) => b.bid === cartItem.book.bid) || null;

      if (book) {
        if (cartItem.quantity > book.quantity) {
          console.log(`Updating quantity for book ${book.bid}`);
          cartItem.quantity = book.quantity;
          console.log(cartItem.quantity)
        }
      }

      newCartItems.push(cartItem)
    }

    this.cartItems = newCartItems
  }

  decreaseQuantity(cartItem: CartItem) {
    let quantity;
    if (cartItem.quantity > 1) {
      quantity = cartItem.quantity - 1;
      this.updateCart(cartItem, quantity);
    }
  }

  disableIncreaseButton(cartItem: CartItem): boolean {
    if (!this.books) {
      return false;
    }
  
    const book = this.books.find((b) => b.bid === cartItem.book.bid);
  
    return book?.quantity == cartItem.quantity;
  }

  checkMaxQuantity(cartItem: CartItem):boolean {
    const book = this.books.find((b) => b.bid === cartItem.book.bid) || null;

    if(book) {
      if(cartItem.quantity == book.quantity) {
        return true;
      }
    }

    return false
  }
  

  increaseQuantity(cartItem: CartItem) {
    const book = this.books.find((b) => b.bid === cartItem.book.bid) || null;

    if(book) {
      if(cartItem.quantity < book.quantity) {
        let quantity = cartItem.quantity + 1;
        this.updateCart(cartItem, quantity);
      }
    }
  }

  async removeFromCart(cartItem:CartItem) {
    this.cart = await this.cartService.removeFromCart(cartItem.book.bid);
  }

  async updateCart(cartItem:CartItem, quantity:number) {
    this.cart = await this.cartService.changeQuantity(cartItem.book.bid, quantity);
  }

  async addOrder() {
    this.user$.subscribe(async (user) => {
      if (user) {
        this.ordersService.addOrder(user, this.cart);
      } else {
        console.error('User data not available.');
      }
    });
  }
}
