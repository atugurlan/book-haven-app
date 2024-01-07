import { Component } from '@angular/core';
import { Order } from 'src/app/models/order';
import { OrderService } from 'src/app/services/order/order.service';
import { UsersService } from 'src/app/services/users/users.service';

@Component({
  selector: 'app-previous-orders',
  templateUrl: './previous-orders.component.html',
  styleUrls: ['./previous-orders.component.css']
})
export class PreviousOrdersComponent {
  user$ = this.usersService.currentUserProfile$;
  customerOrder!:Order[];
  
  constructor(private usersService: UsersService, private ordersService: OrderService) {
    this.getCustomerOrders();
   }

  async getCustomerOrders() {
    this.user$.subscribe( async (user) => {
      if(user) {
        this.customerOrder = await this.ordersService.getAllOrders();
        console.log(this.customerOrder);
      }
      return this.customerOrder;
    });
  }
}
