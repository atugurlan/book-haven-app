import { Injectable } from '@angular/core';
import { Book } from 'src/app/models/book';
import { Firestore, collection, doc, getDocs } from '@angular/fire/firestore';

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
}
