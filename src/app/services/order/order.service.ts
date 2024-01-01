import { Injectable } from '@angular/core';
import { Cart } from 'src/app/models/cart';
import { Firestore, collection, doc, getDocs, setDoc } from '@angular/fire/firestore';
import { from } from 'rxjs';
import { ProfileUser } from 'src/app/models/user-profile';
import { Order } from 'src/app/models/order';
import { CartService } from '../cart/cart-service.service';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(private firestore: Firestore,
              private cartService: CartService) { }

  async getAllOrders():Promise<Order[]> {
    const orders:Order[] = [];
    const querySnapshot = getDocs(collection(this.firestore, "orders"));

    (await querySnapshot).forEach( (doc: { data: () => any; id: any; }) => {
      const orderData: any = doc.data(); 
      const order: Order = {
        id: doc.id,
        customer: orderData.customer, 
        cart: orderData.cart,
        price: orderData.price,
        status: orderData.status
      }
      orders.push(order);
    });

    return orders;
  }

  async addOrder(user:ProfileUser, cart:Cart) {
    let currentUser = user;
    let orders:Order[] = [];

    orders = await this.getAllOrders();

    let maxId = parseInt(orders.length.toString(), 10) + 1;
    console.log(maxId)
    let cartItems = cart.items.map((item) => `${item.quantity} x ${item.book.title}`).join(', ');
    const order = {
      id: maxId + 1,
      customer: currentUser.uid,
      cart: cartItems,
      price: cart.totalPrice,
      status: 'new'
    };
    const ref = doc(this.firestore, 'orders', order.id.toString());
  
    from(setDoc(ref, order)).subscribe(async () => {
      await this.cartService.clearShoppingCart(user.uid);
      }, (error) => {
        console.error('Error adding order:', error);
    });
  }
}
