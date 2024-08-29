import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { userReducerInitialState } from "../../types/reducer-types";
import { userBodyType } from "../../types/api-types";


const initialState :userReducerInitialState = {
  user:null,
  loading:true,
  detectToken:true,
}

export const userReducer = createSlice( {

    name:"userReducer",
    initialState,
    reducers:{

        userExist:( state , action:PayloadAction<userBodyType> )=>{
             state.user=action.payload;
             state.loading=false;
        },
        userNotExist:(state)=>{
          state.user=null ;
          state.loading=false ;
     },
     ChangeDetectToken:(state ,action:PayloadAction<boolean>)=>{
            state.detectToken=action.payload
     }
    }
})

export const{userExist , userNotExist , ChangeDetectToken} = userReducer.actions