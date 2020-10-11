import { Injectable } from "@angular/core";
import { createEffect, Actions, ofType } from "@ngrx/effects";
import { of } from "rxjs";
import { map, concatMap, catchError, tap } from "rxjs/operators";
import { AuthService } from "../shared/services/auth.service";
import { AuthApiActions, AuthUserActions } from "./actions";

// applies @Injectable decorator to AuthApiEffects class
@Injectable()
export class AuthEffects {
  // inject AuthService and Actions into the class
  constructor(private auth: AuthService, private actions$: Actions) { }

  // getAuthSTatus should get the auth status on bootup and dispatch appropriate action when COMPLETE
  getAuthStatus$ = createEffect(() =>
    this.auth
      .getStatus() // authService returns null or user
      .pipe(map(userOrNull => AuthApiActions.getAuthStatusSuccess(userOrNull))) // dispatch action as to whether status is null or user
  );

  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthUserActions.login),
      concatMap(action => {
        return this.auth.login(action.username, action.password).pipe(
          map(user => AuthApiActions.loginSuccess(user)),
          catchError(reason => of(AuthApiActions.loginFailure(reason))) // catchError looks for another observable to subscribe to in lieu of the one that errored out
        );
      })
    )
  );

  //creating
  logout$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthUserActions.logout), // doesnt return observable so use tap
        tap(() => this.auth.logout())
      ),
    { dispatch: false }
  );
}

