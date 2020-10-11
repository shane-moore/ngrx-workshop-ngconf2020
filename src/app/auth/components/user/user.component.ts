import { Component } from "@angular/core";
import { Observable } from "rxjs";
import { UserModel } from "src/app/shared/models";
import { Store } from "@ngrx/store";
import { selectAuthUser, State } from "src/app/shared/state";
import { AuthUserActions } from "../../actions";

@Component({
  selector: "app-user",
  templateUrl: "./user.component.html",
  styleUrls: ["./user.component.css"]
})
export class UserComponent {

  user$: Observable<UserModel | null>;
  constructor(private store: Store<State>) {
    this.user$ = store.select(selectAuthUser);
  };

  // user$: Observable<UserModel | null> = of({
  //   id: "1",
  //   username: "NgRx Learner"
  // });

  onLogout() {
    this.store.dispatch(AuthUserActions.logout());
  }
}
