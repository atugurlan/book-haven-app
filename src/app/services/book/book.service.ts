import { Injectable } from '@angular/core';
import { Book } from 'src/app/models/book';
import { Firestore, collection, doc, getDocs, setDoc, updateDoc } from '@angular/fire/firestore';
import { Cart } from 'src/app/models/cart';
import { ProfileUser } from 'src/app/models/user-profile';
import { CartItem } from 'src/app/models/cart-item';

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

  async getAllBooksBySearchTerm(searchTerm:string):Promise<Book[]> {
    const books = await this.allBooks();

    const filtered_books = books.filter(book => 
            book.title.toLowerCase().includes(searchTerm.toLowerCase()));

    return filtered_books;
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

  async addBookTo(user: ProfileUser, book:Book, location:string) {
    try {
      let item: Book | CartItem
      if(location === 'shopping-cart') {
        item = {
          book: book,
          price: book.price,
          quantity: 1
        }
      }
      else {
        item = book
      }

      const cartDoc = doc(this.firestore,`${location}/${user.uid}/items/${book.bid}`);
      await setDoc(cartDoc, item);
      console.log(`Book item added to the ${location} successfully!`);
    }catch (error) {
      console.error(`Error adding book item to the ${location}:`, error);
    }
  }

  async countGenres(): Promise<{ name: string; count: number }[]> {
    const books = await this.allBooks();
    
    const tagsCountsMap: { [key: string]: number } = {
      'All': books.length,
      'Fiction': 0,
      'Non-fiction': 0,
      'Mistery': 0,
      'Thriller': 0,
      'Romance': 0,
      'Fantasy': 0,
      'Biography': 0,
      'History': 0,
      'Horror': 0,
      'Poetry': 0,
      'Cookbooks': 0
    }

    books.forEach( (book) => {
      const genre = book.genre;
      if(genre) {
        tagsCountsMap[genre] += 1;
      }
    })
  
    const tagsCount: { name: string; count: number }[] = Object.entries(tagsCountsMap).map(
      ([name, count]) => ({ name, count })
    );
  
    return tagsCount;
  }

  async getBooksByGenre(genre:string):Promise<Book[]> {
    const books = await this.allBooks();

    return genre=="All" ? 
            books :
            books.filter(book => book.genre?.includes(genre));
  }

}
