import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { cartProdutType, ShippingInfoType } from "../../types/reducer-types";
import { productItemDataType } from "../../components/ProductItem";


export interface cartReducerInitialState{
      products:cartProdutType[],
      subTotal:number,
      tax:number,
      shippingCharges:number,
      discount:number,
      total:number,
      shippingInfo:ShippingInfoType,
      isRefetch:boolean
      
}


const initialState : cartReducerInitialState = {
      products:[],
      
      subTotal:0,
      tax:0,
      shippingCharges:0,
      discount:0,
      total:0,

      shippingInfo:{
        adress:"",
        city:"",
        state:"",
        country:"",
        pinCode:0,
      },
      isRefetch:false  // only work  for being true when order is crated to reftch intentinally data of search and home latetsy products as they   are cached by productapi rtkQuery and they decahche only product chnage THROUGH them
  }
  
  export const cartReducer = createSlice( {
  
      name: "cartReducer" ,
      initialState ,
      reducers : {

        addAProduct : (state , action:PayloadAction<productItemDataType>)=>{

           // check product if already ther in cart .. to not do anything in that case 
            let check = false;
           state.products.forEach(product => {
            if (product._id==action.payload._id){
                    check=true;
                    
            }
            
           });

         if(!check){ 
          state.products.push( {
          _id:action.payload._id ,
          name:action.payload.name ,
          photo:action.payload.photo ,
          price:action.payload.price ,
          quantity:1,
          stock:action.payload.stock,
        } ) ;
        state.subTotal+=action.payload.price;
        state.tax=Math.round(state.subTotal*0.18);
        
        state.shippingCharges=state.subTotal<=1000 ?0: (state.subTotal<=10000)?100:200
        state.total=state.subTotal+state.tax+state.shippingCharges-state.discount

            
        }
      },
        
         deleteAProduct:(state , action:PayloadAction<{price:number , id:string , quantity:number}>)=>{

              let id = action.payload.id;
              let price =action.payload.price;
              let quantity = action.payload.quantity;

            state.products =  state.products.filter((product)=>{
                return product._id != id
              });

              state.subTotal-=price*quantity;
              state.tax=Math.round(state.subTotal*0.18);
              
              state.shippingCharges=state.subTotal<=1000 ?0: (state.subTotal<=10000)?100:200;
              state.total=state.subTotal+state.tax+state.shippingCharges-state.discount;
         },

          updateQuantity:(state, action:PayloadAction<{ id:string , quantity:number , price:number}>)=>{

               state.products.forEach((product)=>{

                if ( product._id==action.payload.id ) {

                  let diff=action.payload.quantity-product.quantity

                  product.quantity=action.payload.quantity

                  state.subTotal+= ( diff * action.payload.price)
                   
                }
               })
               state.tax=Math.round(state.subTotal*0.18);
              
              state.shippingCharges=state.subTotal<=1000 ?0: (state.subTotal<=10000)?100:200;
              state.total=state.subTotal+state.tax+state.shippingCharges-state.discount;

         },
         addDiscount:(state , action:PayloadAction<number>)=>{
                state.discount = action.payload;
               state.total=state.subTotal+state.tax+state.shippingCharges-state.discount;

         },

         addShipping:(state , action:PayloadAction<ShippingInfoType>)=>{

          state.shippingInfo=action.payload;

         },
         resetCart:()=>initialState,


         ChangeIsRefetch:(state)=>{
          state.isRefetch=!state.isRefetch
         }

       }
      }
  )
  
  export const{addAProduct , deleteAProduct , updateQuantity    , addDiscount , addShipping , resetCart  , ChangeIsRefetch} = cartReducer.actions