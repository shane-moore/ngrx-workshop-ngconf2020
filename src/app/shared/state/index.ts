import { Action, ActionReducer, ActionReducerMap, createSelector, MetaReducer } from "@ngrx/store";
import * as fromAuth from "./auth.reducer";
import * as fromBooks from "./books.reducer";
import { logoutMetareducer } from "./logout.metareducer";

// register the books and auth slices of State w/ the global state interface
export interface State {
  books: fromBooks.State;
  auth: fromAuth.State;
}

// register reducer functions in the global reducer object
export const reducers: ActionReducerMap<State> = {
  auth: fromAuth.reducer,
  books: fromBooks.reducer,

};

// MetaReducers that receives a reducer and returns a reducer
// takes in previous state and can use it to return a new state if wish
function logger(reducer: ActionReducer<any, any>) {
  return (state: any, action: Action) => {
    console.log('previous state', state);
    console.log('action', action);
    const nextState = reducer(state, action);

    return nextState;
  }
}

export const metaReducers: MetaReducer<State>[] = [logoutMetareducer];

/**
 *  Books State
 * take local selectors from books.reducer.ts and export them to become global
 */

// getter function that returns global state of books
export const selectBooksState = (state: State) => state.books;

// getter function that returns global state of auth from local slice of auth state
export const selectAuthState = (state: State) => state.auth;
export const selectActiveBook_unoptimized = (state: State) => {
  const booksState = selectBooksState(state); // can use shorthand below since signatures match

  return fromBooks.selectActiveBook(booksState);
}

// global optimized selector for getting a book out of the global store!
export const selectActiveBook = createSelector(
  selectBooksState, // input
  // (booksState) => fromBooks.selectActiveBook(booksState)
  fromBooks.selectActiveBook // can write as shorthand since signature of project function matches that of selectActiveBook
)

export const selectAllBooks = createSelector(
  selectBooksState,
  fromBooks.selectAll
)

export const selectBooksEarningsTotal = createSelector(
  selectBooksState,
  fromBooks.selectEarningsTotal
);

// globally optimized selector for getting status
export const selectAuthStatus = createSelector(
  selectAuthState, // input
  fromAuth.selectGettingStatus  // global state is passed to fromAuth.selectGettingStatus and returns to you state.gettingStatus
);

export const selectAuthUser = createSelector(
  selectAuthState,
  fromAuth.selectUser
);

export const selectAuthError = createSelector(
  selectAuthState,
  fromAuth.selectError
);
