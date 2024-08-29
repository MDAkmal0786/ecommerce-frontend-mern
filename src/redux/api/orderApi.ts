import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { allOrdersResponse, getAorderResponse, messageResponse, newOrderBody, populatedOrderResponse } from "../../types/api-types";

export const orderApi  = createApi ( {
   
    reducerPath:"orderApi",
    baseQuery:fetchBaseQuery({
       baseUrl:`${import.meta.env.VITE_SERVER}/api/v1/order/`,
    }),
    tagTypes:["orders"],
    endpoints : (builder)=>({


         getMyOrders:builder.query<allOrdersResponse , string>({
            query:(id)=>`my?id=${id}`,
            providesTags:["orders"],
         }),
         getAllOrders:builder.query<populatedOrderResponse , string>({
            query:(id)=>`all?id=${id}`,
            providesTags:["orders"],
         }),
         getAOrder:builder.query<getAorderResponse , string>({
            query:(id)=>`${id}`,
            providesTags:["orders"],
         }),
    
          newOrder:builder.mutation<messageResponse , newOrderBody>({
            query:(body)=>({
               url:"new", 
               method:"POST",
               body:body,
            }),
            invalidatesTags:["orders"],
          }),
          orderDelete : builder.mutation<messageResponse , {orderId:string , userId:string}>({
            query:({orderId , userId})=>({
               url:`${orderId}?id=${userId}`,
               method:"DELETE",
              
            }),
            invalidatesTags:["orders"],
          }),
          orderUpdate : builder.mutation<messageResponse , {orderId:string , userId:string}>({
            query:({orderId , userId})=>({
               url:`${orderId}?id=${userId}`,
               method:"PUT",
              
            }),
            invalidatesTags:["orders"],
          }),
         

    })

});


export const { useNewOrderMutation , useGetMyOrdersQuery , useGetAllOrdersQuery , useGetAOrderQuery  , useOrderDeleteMutation , useOrderUpdateMutation} = orderApi ;