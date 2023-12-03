import { Component } from '@angular/core';
import { Cart } from 'src/app/models/cart';
import { CartItem } from 'src/app/models/cart-item';
import { CartService } from 'src/app/services/cart/cart-service.service';
import { UsersService } from 'src/app/services/users/users.service';

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.css']
})
export class ShoppingCartComponent {
  cart!:Cart;
  cartItems!:CartItem[];
  priceItem!:number;

  user$ = this.usersService.currentUserProfile$;

  constructor(private usersService: UsersService,
              private cartService: CartService) {
    this.setCart();
  }

  async setCart() {
    this.cart = await this.cartService.getCart();
  }

  async removeFromCart(cartItem:CartItem) {
    this.cart = await this.cartService.removeFromCart(cartItem.book.bid);
  }
}
