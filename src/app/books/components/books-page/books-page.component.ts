import { Component, OnInit } from "@angular/core";
import { Store } from "@ngrx/store";
import { Observable } from 'rxjs'
import {
  State,
  selectAllBooks,
  selectActiveBook,
  selectBooksEarningsTotal
} from "src/app/shared/state";
import {
  BookModel,
  calculateBooksGrossEarnings,
  BookRequiredProps
} from "src/app/shared/models";
// import { BooksService } from "src/app/shared/services";
import { BooksPageActions, BooksApiActions } from "../../actions";

/**
 * after refactor, we've isolated this component down to just one responsibility.
 * It is now connecting its components to the store
 * It's reading state out of the store using selectors and handling events from the template and dispatching actions as a RESULT
 * Essentially, not it's a presentational (smart-connected) component
*/
@Component({
  selector: "app-books",
  templateUrl: "./books-page.component.html",
  styleUrls: ["./books-page.component.css"]
})
export class BooksPageComponent implements OnInit {
  // books: BookModel[] = [];
  books$: Observable<BookModel[]> = this.store.select(selectAllBooks);

  // currentBook: BookModel | null = null;

  currentBook$: Observable<BookModel | null | undefined> = this.store.select(selectActiveBook);
  total$: Observable<number> // also could do = this.store.select(selectBooksEarningsTotal); if don't want to declare in constructor. save a line of code ha

  constructor(
    // private booksService: BooksService,
    private store: Store<State>
  ) {
    this.total$ = store.select(selectBooksEarningsTotal); // get total out of the store
  }

  ngOnInit() {
    this.store.dispatch(BooksPageActions.enter()); // this interaction will trigger the associated effect

    // this.getBooks();
    this.removeSelectedBook();
  }

  // getBooks() {
  //   this.booksService.all().subscribe(books => {
  //     // this.books = books;
  //     // this.updateTotals(books);

  //     this.store.dispatch(BooksApiActions.booksLoaded({ books }));
  //   });
  // }

  // updateTotals(books: BookModel[]) {
  //   this.total = calculateBooksGrossEarnings(books);
  // }

  onSelect(book: BookModel) {
    this.store.dispatch(BooksPageActions.selectBook({ bookId: book.id }));

    // this.currentBook = book;
  }

  onCancel() {
    this.removeSelectedBook();
  }

  removeSelectedBook() {
    this.store.dispatch(BooksPageActions.clearSelectedBook());

    // this.currentBook = null;
  }

  onSave(book: BookRequiredProps | BookModel) {
    if ("id" in book) {
      this.updateBook(book);
    } else {
      this.saveBook(book);
    }
  }

  saveBook(bookProps: BookRequiredProps) {
    this.store.dispatch(BooksPageActions.createBook({ book: bookProps }));

    // this.booksService.create(bookProps).subscribe(book => {
    //   // this.getBooks();
    //   this.removeSelectedBook();

    //   this.store.dispatch(BooksApiActions.bookCreated({ book }));
    // });
  }

  updateBook(book: BookModel) {
    this.store.dispatch(
      BooksPageActions.updateBook({ bookId: book.id, changes: book })
    );

    // this.booksService.update(book.id, book).subscribe(book => {
    //   // this.getBooks();
    //   this.removeSelectedBook();

    //   this.store.dispatch(BooksApiActions.bookUpdated({ book }));
    // });
  }

  onDelete(book: BookModel) {
    this.store.dispatch(BooksPageActions.deleteBook({ bookId: book.id }));

    // this.booksService.delete(book.id).subscribe(() => {
    //   // this.getBooks();
    //   this.removeSelectedBook();

    // this.store.dispatch(BooksApiActions.bookDeleted({ bookId: book.id }));
    // });
  }
}
