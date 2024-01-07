import { Injectable } from '@angular/core';
import { Cart } from 'src/app/models/cart';
import { Firestore, collection, doc, getDocs, setDoc } from '@angular/fire/firestore';
import { from } from 'rxjs';
import { ProfileUser } from 'src/app/models/user-profile';
import { Order } from 'src/app/models/order';
import { CartService } from '../cart/cart-service.service';
import { BookService } from '../book/book.service';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(private firestore: Firestore,
              private cartService: CartService,
              private bookService: BookService) { }

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
        email: orderData.email,
        name: orderData.name,
        address: orderData.address,
        phone: orderData.phone,
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

    let maxId = parseInt(orders.length.toString(), 10);
    let cartItems = cart.items.map((item) => `${item.quantity} x ${item.book.title}`).join(', ');
    let name = user.firstName + " " + user.lastName;
    const order = {
      id: maxId + 1,
      customer: currentUser.uid,
      cart: cartItems,
      price: cart.totalPrice,
      email: user.email,
      name: name,
      address: user.address,
      phone: user.phone,
      status: 'new'
    };
    const ref = doc(this.firestore, 'orders', order.id.toString());

    this.bookService.refreshBooksQuantities(cart)
  
    from(setDoc(ref, order)).subscribe(async () => {
      await this.cartService.clearShoppingCart(user.uid);
      }, (error) => {
        console.error('Error adding order:', error);
    });
  }

  async getMostOrderedBooks(): Promise<{ bookId: string, count: number }[]> {
    const orders: Order[] = await this.getAllOrders();
  
    const bookOrderCountMap: Map<string, number> = new Map();
  
    orders.forEach(order => {
      const cartItems = order.cart.split(', '); // Assuming the cart items are separated by ', '
  
      cartItems.forEach(item => {
        const [quantityString, ...titleParts] = item.trim().split(' x '); // Splitting quantity and title
        
        const quantity = parseInt(quantityString, 10); // Convert quantity to a number
        const title = titleParts.join(' x '); // Reconstruct the book title in case it contains 'x'
  
        // Ensure title exists in the map
        if (bookOrderCountMap.has(title)) {
          bookOrderCountMap.set(title, bookOrderCountMap.get(title)! + quantity);
        } else {
          bookOrderCountMap.set(title, quantity);
        }
      });
    });
  
    // Convert map to an array of objects for easier sorting and manipulation
    const bookOrderCounts: { bookId: string, count: number }[] = [];
    bookOrderCountMap.forEach((count, bookId) => {
      bookOrderCounts.push({ bookId, count });
    });
  
    // Sort books by order count in descending order
    bookOrderCounts.sort((a, b) => b.count - a.count);
  
    return bookOrderCounts;
  }
  
  


}
