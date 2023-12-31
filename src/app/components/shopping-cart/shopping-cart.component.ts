import { Component, OnInit } from '@angular/core';
import { Firestore, doc, setDoc } from '@angular/fire/firestore';
import { from } from 'rxjs';
import { Cart } from 'src/app/models/cart';
import { CartItem } from 'src/app/models/cart-item';
import { Order } from 'src/app/models/order';
import { ProfileUser } from 'src/app/models/user-profile';
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

  user$ = this.usersService.currentUserProfile$;

  constructor(private usersService: UsersService,
              private cartService: CartService,
              private firestore: Firestore,
              private ordersService: OrderService) { }
  
  async ngOnInit(): Promise<void> {
    this.cart = await this.cartService.getCart();
  }

  async setCart() {
    this.cart = await this.cartService.getCart();
  }

  decreaseQuantity(cartItem: CartItem) {
    let quantity;
    if (cartItem.quantity > 1) {
      quantity = cartItem.quantity - 1;
      this.updateCart(cartItem, quantity);
    }
  }

  increaseQuantity(cartItem: CartItem) {
    let quantity = cartItem.quantity + 1;
    this.updateCart(cartItem, quantity);
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
