import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { alluserType, messageResponse, userBodyType, userResponse } from "../../types/api-types";
import axios from "axios";

export const userApi  = createApi ( {
   
     reducerPath:"userApi",
     baseQuery:fetchBaseQuery({
        baseUrl:`${import.meta.env.VITE_SERVER}/api/v1/user/`,
     }),

     tagTypes:["users"],
     endpoints : (builder)=>({

      allUser:builder.query<alluserType,string>({
         query:(id)=>`all?id=${id}`,
         providesTags:["users"]
      }),

        newUser : builder.mutation<messageResponse , userBodyType>({
            query:(user)=>({
               url:"new",
               method:"POST",
               body:user
            }),
            invalidatesTags:["users"]
        }),
        deleteUser : builder.mutation<messageResponse , {userId:string , currentUserId:string}>({
         query:({userId , currentUserId})=>({
            url:`${userId}?id=${currentUserId}`,
            method:"DELETE",
            
         }),
         invalidatesTags:["users"]
     }),
     updateUser : builder.mutation<messageResponse , {userId:string , currentUserId:string}>({
      query:({userId , currentUserId})=>({
         url:`${userId}?id=${currentUserId}`,
         method:"PUT",
         
      }),
      invalidatesTags:["users"]
  }),

      
          

     })

});

export const getUser =  async(id:string)=>{

  try{
   
   const {data}:{data:userResponse} = await axios.get(`${import.meta.env.VITE_SERVER}/api/v1/user/${id}`);
   return data ;

  }
  catch(error){

   return undefined;

  }

}

export const {useNewUserMutation , useAllUserQuery , useDeleteUserMutation , useUpdateUserMutation } = userApi ;