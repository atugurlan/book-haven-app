import { Component, OnInit } from '@angular/core';
import { Firestore, doc, setDoc } from '@angular/fire/firestore';
import { Subscription, from, interval } from 'rxjs';
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
  }

  ngOnDestroy(): void {
    this.updateSubscription.unsubscribe();
  }

  async setCart() {
    this.cart = await this.cartService.getCart();
  }

  async maximumQuantity(cartItem: CartItem):Promise<boolean> {
    const books = await this.bookService.allBooks();

    const book = books.find((b) => b.bid === cartItem.book.bid) || null;

    if (book) {
      if (cartItem.quantity >= book.quantity) {
        return true;
      }
    }

    return false;
  }

  async checkQuantity() {
    const books = await this.bookService.allBooks();

    for (const cartItem of this.cartItems) {
      const book = books.find((b) => b.bid === cartItem.book.bid) || null;

      if (book) {
        if (cartItem.quantity > book.quantity) {
          console.log(`Updating quantity for book ${book.bid}`);
          cartItem.quantity = book.quantity;
        }
      }
    }
  }

  decreaseQuantity(cartItem: CartItem) {
    let quantity;
    if (cartItem.quantity > 1) {
      quantity = cartItem.quantity - 1;
      this.updateCart(cartItem, quantity);
      this.checkQuantity()
    }
  }

  increaseQuantity(cartItem: CartItem) {
    let quantity = cartItem.quantity + 1;
    this.updateCart(cartItem, quantity);
    this.checkQuantity()
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
