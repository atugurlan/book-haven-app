import { Injectable } from '@angular/core';
import { Book } from 'src/app/models/book';
import { Firestore, collection, doc, getDocs, updateDoc } from '@angular/fire/firestore';
import { Cart } from 'src/app/models/cart';

@Injectable({
  providedIn: 'root'
})
export class BookService {
  book!:Book;

  constructor(private firestore: Firestore) { }

  async allBooks():Promise<Book[]> {
    const books:Book[] = [];

    const querySnapshot = getDocs(collection(this.firestore, "books"));

    (await querySnapshot).forEach( (doc: { data: () => any; id: any; }) => {
      const bookData: any = doc.data(); 
      const book: Book = {
        bid: doc.id,
        bookcoverURL: bookData.bookcoverURL,
        title: bookData.title,
        author: bookData.author,
        price: bookData.price,
        quantity: bookData.quantity,
        genre: bookData.genre,
        description: bookData.description
      }
      books.push(book);
    });

    return books;
  }

  async getBookByBID(bid:string):Promise<Book | undefined> {
    const books = await this.allBooks();
    return books.find(book => book.bid == bid);
  } 

  async refreshBooksQuantities(cart: Cart) {
    try{
      let books = await this.allBooks()
      cart.items.forEach((cartItem) => {
          let bookIndex = books.findIndex((book) => book.bid === cartItem.book.bid);

          books[bookIndex].quantity -= cartItem.quantity;
      });
      // console.log(books)

      const bookCollection = collection(this.firestore, `books`);
      
      await Promise.all(
        books.map(async (book) => {
            const bookDocRef = doc(bookCollection, book.bid);
            await updateDoc(bookDocRef, { quantity: book.quantity });
        })
      );
    } catch (error) {
      console.error("Error updating book quantities:", error);
    }
  }

}
