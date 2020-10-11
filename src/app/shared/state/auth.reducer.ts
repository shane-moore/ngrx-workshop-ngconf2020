import { UserModel } from "../models";
import { createReducer, on, Action } from "@ngrx/store";
import { AuthApiActions, AuthUserActions } from "src/app/auth/actions";
import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { getAuthStatusSuccess, loginSuccess } from 'src/app/auth/actions/auth-api.actions';

// creates an unsorted entity adapter for State
// reducer will merge new actions with existing state
// action was that the username and password were passed up from login form and dispatched to store from login-page.component


// create interface to keep track of the three types of state we're tracking
export interface State {
  // am I currently retrieving the authentication status?
  gettingStatus: boolean; // going to boot up and start asking api if user is authenticated so need to keep track of if they are or arent

  // reducer needs to listen for who is current user trying to log in?
  user: null | UserModel; // could also maybe not have a user so have null option
  // was there an error when the user attempted to log in?
  error: null | string; // null if no error

  // collection: BookModel[]; comment out since now using Entity to manage array of books
}

// export const adapter = createEntityAdapter<UserModel>();

// initial state to implement the interface
export const initialState: State = {
  gettingStatus: true, // boot up and will ask api if user is authenticated so yes, we're trying to get status
  user: null, // don't know if anyone's auth'd yet
  error: null // no error cuz api havent had chance to fail
};

export const authReducer = createReducer(
  initialState,
  on(AuthUserActions.logout, (state, action) => {
    return {
      ...state,
      gettingStatus: false, // no outbound user requests
      user: null,
      error: null
    }
  }),
  on(AuthUserActions.login, (state, action) => {
    return {
      ...state,
      gettingStatus: true,
      user: null,
      error: null
    };
  }),
  on(AuthApiActions.getAuthStatusSuccess, (state, action) => {
    return {
      ...state,
      gettingStatus: false,
      user: action.user,
      error: null
    };
  })
  ,
  on(AuthApiActions.loginSuccess, (state, action) => { // state transition function
    return {
      ...state,
      gettingStatus: false,
      user: action.user,
      error: null
    }
  }),
  on(AuthApiActions.loginFailure, (state, action) => {
    return {
      gettingStatus: false,
      user: null,
      error: action.reason
    }
  })
);

export function reducer(state: State | undefined, action: Action) {
  return authReducer(state, action);
}

// define getter selectors for the local state of each property we're tracking
export const selectGettingStatus = (state: State) => state.gettingStatus;

export const selectUser = (state: State) => state.user;

export const selectError = (state: State) => state.error;
