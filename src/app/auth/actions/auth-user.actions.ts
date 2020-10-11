import { createAction } from "@ngrx/store";
import { UserModel } from "../../shared/models/index"

// two actions user can do
// user Submit Login Request
export const login = createAction(
  "[Auth/User] Login",  // Group and event being captured
  (username: string, password: string) => ({ username, password }) //payload, supplying a custom function that lets us control signature of this action creator
  // translates to being able to call login('username','password') elsewhere
);

// user Submit Logout Request
export const logout = createAction("[Auth/User] Logout")
