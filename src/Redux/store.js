import { createStore } from "redux";
import rootReducer from "./Reducer/rootReducer";
import { persistReducer , persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";


const persistConfig ={
    key:'root',
    storage,
   // blacklist : ["Auth"],
   whitelist :["Auth"]
}


const perstReducer = persistReducer(persistConfig, rootReducer)
const Store = createStore(perstReducer)
export const perstore = persistStore(Store)
export default Store;