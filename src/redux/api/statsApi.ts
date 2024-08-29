import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { barType, lineType, pieType, statsType } from "../../types/api-types";

export const statsApi  = createApi ( {
   
    reducerPath:"statsApi",
    baseQuery:fetchBaseQuery({
       baseUrl:`${import.meta.env.VITE_SERVER}/api/v1/dashboard/`,
    }),
    endpoints:(builder)=>({

        stats:builder.query<statsType , string>({
            query:(id)=>`stats?id=${id}`,
            keepUnusedDataFor:0
         }),
         pie:builder.query<pieType , string>({
            query:(id)=>`pie?id=${id}`,
            keepUnusedDataFor:0
         }),
         line:builder.query<lineType , string>({
            query:(id)=>`line?id=${id}`,
            keepUnusedDataFor:0
         }),
         bar:builder.query<barType , string>({
            query:(id)=>`bar?id=${id}`,
            keepUnusedDataFor:0
         }),

    })

    

});

export const{useStatsQuery , usePieQuery , useLineQuery , useBarQuery} = statsApi;