import { Book } from "./book";

export class CartItem {
    book:Book;
    quantity:number=1;
    
    constructor(book:Book) {
        this.book = book;
        this.price;
    }

    get price():number{
        return this.book.price * this.quantity;
    }
}
