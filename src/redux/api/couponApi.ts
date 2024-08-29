import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { CouponResponse, messageResponse } from "../../types/api-types";

export const couponApi  = createApi ( {
   
    reducerPath:"couponApi",
    baseQuery:fetchBaseQuery({
       baseUrl:`${import.meta.env.VITE_SERVER}/api/v1/payment/coupon/`,
    }),

    tagTypes:["coupons"],
    endpoints : (builder)=>({

     allCoupon:builder.query<CouponResponse,string>({
        query:(id)=>`all?id=${id}`,
        providesTags:["coupons"]
     }),

       newCoupon : builder.mutation<messageResponse , {code:string , amount:number , userId:string}>({
           query:({code , amount, userId})=>({
              url:`new?id=${userId}`,
              method:"POST",
              body:{code , amount}
           }),
           invalidatesTags:["coupons"]
       }),
       deleteCoupon : builder.mutation<messageResponse , {couponId:string , currentUserId:string}>({
        query:({couponId , currentUserId})=>({
           url:`${couponId}?id=${currentUserId}`,
           method:"DELETE",
           
        }),
        invalidatesTags:["coupons"]
    }),

     
         

    })

});

export const{useAllCouponQuery , useDeleteCouponMutation , useNewCouponMutation}= couponApi;