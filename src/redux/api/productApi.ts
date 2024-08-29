import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { categoryType, deleteType, filterType, getAProductResponse, latestResponse, messageResponse, newArgsType, searchType, updateType } from "../../types/api-types";

export const productApi  = createApi ( {
   
    reducerPath:"productApi",
    baseQuery:fetchBaseQuery({
       baseUrl:`${import.meta.env.VITE_SERVER}/api/v1/product/`,
    }),
    tagTypes:["product"],
    
    endpoints : (builder)=>({

       latestProduct : builder.query<latestResponse , string>({
           query:()=>"latest",
           providesTags:["product"],
       }),
       allProducts : builder.query<latestResponse , string>({
        query:(id)=>`admin-products?id=${id}`,
        providesTags:["product"],
    }),

    searchProducts : builder.query<searchType , filterType>({
        query:(filter)=>`search?name=${filter.name}&category=${filter.category}&sort=${filter.sort}&price=${filter.maxPrice}&page=${filter.page}`,
        providesTags:["product"],
    }),

    allCategories : builder.query<categoryType , string>({      
        query:()=>"categories",
        providesTags:["product"],
    }),
    getAProduct : builder.query<getAProductResponse , string>({      
        query:(id)=>`${id}`, // /product/:id
        providesTags:["product"],
    }),

    newProducts: builder.mutation<messageResponse , newArgsType>({
        query:({body , _id})=>({

            url:`new?id=${_id}`,
            method:"POST",
            body:body, // u pass formdata in body only  --> form data is for image  .. multer


        }),
        invalidatesTags:["product"],
    }),

    deleteProducts: builder.mutation<messageResponse , deleteType>({
        query:({userId ,  productId})=>({

            url:`${productId}?id=${userId}`, // dynamic    api/v1/product/:id
            method:"DELETE",
        }),
        invalidatesTags:["product"],
    }),
    updateProducts: builder.mutation<messageResponse , updateType>( {
        query:({userId ,  productId , body})=>({

            url:`${productId}?id=${userId}`, // dynamic    api/v1/product/:id
            method:"PUT",
            body:body,
        }),
        invalidatesTags:["product"],
    }),
    forceInvalidate:builder.mutation<string,string>({
        query:()=>({
          url:""
        }),
        invalidatesTags:["product"],
    })

     
         

    })

});

export const {useLatestProductQuery , useAllProductsQuery , useSearchProductsQuery , useAllCategoriesQuery , useNewProductsMutation ,useDeleteProductsMutation , useGetAProductQuery , useUpdateProductsMutation , useForceInvalidateMutation} = productApi;