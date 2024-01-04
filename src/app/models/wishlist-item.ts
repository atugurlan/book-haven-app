import { Book } from "./book";

export class WishlistItem {
    book:Book;

    constructor(book:Book) {
        this.book = book;
    }
}