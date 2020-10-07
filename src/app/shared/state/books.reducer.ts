import { createReducer, on, Action, createSelector } from "@ngrx/store";
import { createEntityAdapter, EntityState } from "@ngrx/entity";
import { BookModel, calculateBooksGrossEarnings } from "src/app/shared/models";
import { BooksPageActions, BooksApiActions } from "src/app/books/actions";

// const createBook = (books: BookModel[], book: BookModel) => [...books, book];
// const updateBook = (books: BookModel[], changes: BookModel) =>
//   books.map(book => {
//     return book.id === changes.id ? Object.assign({}, book, changes) : book;
//   });
// const deleteBook = (books: BookModel[], bookId: string) =>
//   books.filter(book => bookId !== book.id);

// now using EntityState to define State
export interface State extends EntityState<BookModel> {
  activeBookId: string | null;
  // collection: BookModel[]; comment out since now using Entity to manage array of books
}



// creates an unsorted entity adapter for State
export const adapter = createEntityAdapter<BookModel>()

// use adapter to initialize initialState
export const initialState: State = adapter.getInitialState({
  activeBookId: null
})

// export const initialState: State = {
//   collection: [],
//   activeBookId: null
// };

export const booksReducer = createReducer(
  initialState,
  on(BooksPageActions.clearSelectedBook, BooksPageActions.enter, state => {
    return {
      ...state,
      activeBookId: null
    };
  }),
  on(BooksPageActions.selectBook, (state, action) => {
    return {
      ...state,
      activeBookId: action.bookId
    };
  }),
  on(BooksApiActions.booksLoaded, (state, action) => {
    return adapter.setAll(action.books, state);
  }),
  on(BooksApiActions.bookCreated, (state, action) => {
    return adapter.addOne(action.book, {
      ...state,
      activeBookId: null
    });
    // return {
    //   collection: createBook(state.collection, action.book),
    //   activeBookId: null
    // };
  }),
  on(BooksApiActions.bookUpdated, (state, action) => {
    // return {
    //   collection: updateBook(state.collection, action.book), // when we update a book, not only are we going to update state of the collection
    //   activeBookId: null // but we are also going to set the bookId to null. Therefore, one action can result in many state changes
    // };

    return adapter.updateOne(
      { id: action.book.id, changes: action.book },
      {
        ...state,
        activeBookId: null
      }
    );
  }),
  on(BooksApiActions.bookDeleted, (state, action) => {
    // return {
    //   ...state,
    //   collection: deleteBook(state.collection, action.bookId)
    // };
    return adapter.removeOne(action.bookId, state);
  })
);
// on(BooksApiActions.bookUpdated, (state, action) => {
// return {
//   collection: updateBook(state.collection, action.book),
//   activeBookId: null
// }
// })

export function reducer(state: State | undefined, action: Action) {
  return booksReducer(state, action);
}


/**
 *
 * Selectors below operate on the state object itself
 * Local selectors, not operating on global state yet
 * need to connect them to global state object
 */

// getter function
// export const selectAll = (state: State) => state.collection;

export const { selectAll, selectEntities } = adapter.getSelectors();
export const selectActiveBookId = (state: State) => state.activeBookId;

/**
 * Complex Selectors
 */
export const selectActiveBook_unoptimized = (state: State) => {
  // Inputs
  const books = selectAll(state);
  const activeBookId = selectActiveBookId(state);

  // computation
  return books.find(book => book.id === activeBookId)
}

export const selectActiveBook = createSelector(
  selectEntities, // results go into projector function below
  selectActiveBookId,  // results go into  projector function below
  (booksEntities, activeBookId) => { // only reruns this function if either of the two inputs above change
    return activeBookId ? booksEntities[activeBookId]! : null;
  }
)

export const selectEarningsTotal_unoptimized = (state: State) => {
  const books = selectAll(state);

  return calculateBooksGrossEarnings(books)
}
export const selectEarningsTotal = createSelector(
  selectAll,
  // books => calculateBooksGrossEarnings(books)
  calculateBooksGrossEarnings
)
