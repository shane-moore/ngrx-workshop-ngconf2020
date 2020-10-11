import { ActionReducer, Action } from "@ngrx/store";
import { AuthUserActions } from "src/app/auth/actions";

// reset all state when a logout action is dispatched
export function logoutMetareducer(reducer: ActionReducer<any>) {
  return function (state: any, action: Action) {
    if (action.type === AuthUserActions.logout.type) {
      return reducer(undefined, action); // passing in undefined short circuits the reducer and resets all state
    }

    return reducer(state, action); // otherwise return all state
  };
}
