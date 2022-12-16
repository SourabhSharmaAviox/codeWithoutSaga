import { ActionsObject } from "./ActionTypes";

export const AuthSet = (payload) => {
  console.log(payload,"action")
  return {
    type: ActionsObject.AUTH_SAVE,
    payload,
  };
};

export const AuthRemove = () => {
  return {
    type: ActionsObject.AUTH_REMOVE,
  };
};


