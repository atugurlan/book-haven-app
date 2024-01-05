import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Book } from 'src/app/models/book';
import { BookService } from 'src/app/services/book/book.service';

@Component({
  selector: 'app-delete-product',
  templateUrl: './delete-product.component.html',
  styleUrls: ['./delete-product.component.css']
})
export class DeleteProductComponent implements OnInit {
  bookIdToDelete!: string;
  bookToDelete!: Book | undefined;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private bookService: BookService,
    private toastr: ToastrService
  ) {}

  async ngOnInit(): Promise<void> {
    this.bookIdToDelete = this.route.snapshot.params['bid'];
    this.bookToDelete = await this.bookService.getBookByBID(this.bookIdToDelete);
  }

  async deleteBook(): Promise<void> {
    if (this.bookToDelete) {
      const confirmed = confirm(`Are you sure you want to delete "${this.bookToDelete.title}"?`);
      
      if (confirmed) {
        this.bookService.deleteBook(this.bookIdToDelete)
          .subscribe(
            () => {
              this.toastr.success('Book deleted successfully!');
              this.router.navigate(['/book']); 
            },
            () => {
              this.toastr.error('There was an error in deleting the book!');
            }
          );
      }
    } else {
      this.toastr.error('Book not found for deletion!');
    }
  }
}
