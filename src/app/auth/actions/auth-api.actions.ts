import { createAction, props } from "@ngrx/store";
import { UserModel } from "src/app/shared/models";

// the idea here is to pair one action for each emmission type of the observables that are returned by the service

// since getStatus can only succeed, we write one action for it
export const getAuthStatusSuccess = createAction(
  "[Auth/Api] Get Auth Status Success",
  (user: UserModel | null) => ({ user })
)

// since login can succeed or failr/ we werite an action for each case
export const loginSuccess = createAction(
  "[Auth/Api] Login Success",
  (user: UserModel) => ({ user })
);

export const loginFailure = createAction(
  "[Auth/Api] Login Failure",
  (reason: string) => ({ reason })
)

// since logging out doesnt emit anything just happens, dont need to model this with an action
