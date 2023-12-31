import { Cart } from "./cart";

export class Order {
    id!:number;
    customer!:string;
    cart!:Cart;
    price!:number;
    status!:string;
    isEditable?: boolean;
}
