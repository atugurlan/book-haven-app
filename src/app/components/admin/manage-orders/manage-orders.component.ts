import { Component, OnInit } from '@angular/core';
import { OrderService } from 'src/app/services/order/order.service';
import { Order } from 'src/app/models/order';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-manage-orders',
  templateUrl: './manage-orders.component.html',
  styleUrls: ['./manage-orders.component.css']
})
export class ManageOrdersComponent implements OnInit {
  allOrders: Order[] = [];
  orderExpanded: any = null;

  constructor(private orderService: OrderService, private toastr: ToastrService) {}

  ngOnInit(): void {
    this.getAllOrders();
  }

  getAllOrders(): void {
    this.orderService.getAllOrders()
      .then((orders: Order[]) => {
        this.allOrders = orders;
      })
      .catch((error) => {
        console.error('Error fetching orders:', error);
      });
  }

  changeOrderStatus(order: Order, newStatus: string): void {
    const orderIdAsString = order.id.toString();
    this.orderService.updateOrderStatus(orderIdAsString, newStatus).subscribe(
      () => {
        order.status = newStatus;
        console.log('Order status updated successfully!');
        this.toastr.success('Order status updated successfully!!'); 
      },
      (error) => {
        console.log('There was an error in updating the order status!');
        this.toastr.success('There was an error in updating the order status!!');
      }
    );
  }

  hideAcceptButton(order: Order): boolean {
    return order.status === 'Accepted';
  }

  hideInProgressButton(order: Order): boolean {
    return order.status === 'InDeliveryProgress' || order.status === 'Accepted';
  }

  hideDeliveredButton(order: Order): boolean {
    return order.status === 'SuccessfullyDelivered';
  }

  toggleExpandedOrder(orderId: number): void {
    this.orderExpanded = this.orderExpanded === orderId ? null : orderId;
  }

}
