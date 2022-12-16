import { ActionsObject } from "./ActionTypes"

export const SaveAllPostAction=(payload)=>{

    return{
        type:ActionsObject.SAVE_ALL_POST,
        payload
    }
}
  
 