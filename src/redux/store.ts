import { configureStore } from "@reduxjs/toolkit";
import { userApi } from "./api/userApi";
import { userReducer } from "./reducers/userReducer";
import { productApi } from "./api/productApi";
import { cartReducer } from "./reducers/cartReducer";
import { orderApi } from "./api/orderApi";
import { couponApi } from "./api/couponApi";
import { statsApi } from "./api/statsApi";

// export const server =  import.meta.env.VITE_SERVER;


export const store = configureStore({
    reducer:{  // combined reducres

        // api queries
     [userApi.reducerPath] : userApi.reducer,
     [orderApi.reducerPath]:orderApi.reducer,
     [productApi.reducerPath] : productApi.reducer,
     [couponApi.reducerPath] :couponApi.reducer,
     [statsApi.reducerPath] :statsApi.reducer,
     //  reducer + state
     [userReducer.name] : userReducer.reducer,
     [cartReducer.name] : cartReducer.reducer
    },

 middleware: (mid)=> mid().concat([userApi.middleware , productApi.middleware,orderApi.middleware , couponApi.middleware ,statsApi.middleware]) // add [ api RTKquery middlwares ] in deafult middleware

})

export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch