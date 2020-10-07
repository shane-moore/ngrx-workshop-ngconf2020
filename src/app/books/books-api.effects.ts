import { Injectable } from "@angular/core";
import { createEffect, Actions, ofType } from "@ngrx/effects";
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { mergeMap, map, exhaustMap, concatMap, withLatestFrom, switchMap, catchError } from "rxjs/operators";
import { BooksService } from "../shared/services";
import { selectAllBooks, State } from '../shared/state';
import { BooksPageActions, BooksApiActions } from "./actions";
@Injectable()
export class BooksApiEffects {
  constructor(private booksService: BooksService,
    private actions$: Actions, // using private, public, or readonly here is a shorthand in TypeScript to declare a property on a class, and the Actions Interface is returns an Observable of all actions
    private store: Store<State>) { } // import store if want current state of store

  loadBooks$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BooksPageActions.enter), // ofType filters ALL the actions down to just the one you want
      exhaustMap(() => {
        return this.booksService
          .all()
          .pipe(map(books => BooksApiActions.booksLoaded({ books })))
      })
    )
  );

  deleteBook$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(BooksPageActions.deleteBook),
      withLatestFrom(this.store.select(selectAllBooks)), // if want to get latest from store
      mergeMap(([action, books]) => {
        return this.booksService
          .delete(action.bookId)
          .pipe(
            map(() => BooksApiActions.bookDeleted({ bookId: action.bookId }))
          )
      })
    )
  }
    // , { dispatch: false } if wanted to not dispatch this effect as an event
    // effect HAS to map to an action if dispatch is not set to false, browser will crash
  );

  updateBook$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BooksPageActions.updateBook),
      concatMap(action => { // could destructure this to { bookId, changes }
        return this.booksService
          .update(action.bookId, action.changes) // then this would just be bookId, changes
          .pipe(
            map((book) => BooksApiActions.bookUpdated({ book }))
          )
      })
    )
  )

  createBook$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(BooksPageActions.createBook),
      concatMap(action => {
        return this.booksService
          .create(action.book)
          .pipe(
            map((book) => BooksApiActions.bookCreated({ book }))
            //,catchError( error => of(BooksApiActions.createFailure({
            //error,
            //book: action.book
            //}
          )
      })
    )
  })

}

/**
 * effects don't need to start w/ the action service
 * they can be any observable
 * creating snackbars via Angular Material could be an effect
 * creating Modals can happen via effect
 * effects dont need to actually dispatch an action at all, which means we dont have to map things to actions. accompolished by { dispatch: false }
 *
*/

