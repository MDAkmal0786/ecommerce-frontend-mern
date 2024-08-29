import { useEffect, useState } from "react"
import ProductItem from "../components/ProductItem";
import { filterType, messageResponse } from "../types/api-types";
import { useAllCategoriesQuery, useForceInvalidateMutation, useSearchProductsQuery } from "../redux/api/productApi";
import { Skeleton } from "../components/Loader";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { ChangeIsRefetch } from "../redux/reducers/cartReducer";

    








const Search = () => {

  let dispatch = useDispatch();
  let [forceInvalidate] = useForceInvalidateMutation();
  let {isRefetch} = useSelector((state:RootState)=>state.cartReducer)

  useEffect(()=>{

    if (isRefetch){

      dispatch( ChangeIsRefetch() ) ;// @ts-ignore
       forceInvalidate("").then((res)=>{
       })
    }

  },[isRefetch]);

  const [filters , setFilters] = useState<filterType>( {

       name : "" ,
       category : "" ,
       maxPrice : 1000000 ,
       sort : undefined,
       page : 1 ,

  } ) ;
 const res = useAllCategoriesQuery("");
 const categoryData = res.data;
 
const categoryIsError = res.isError;
const categoryError = res.error;

if ( categoryIsError ){
  let err = categoryError as FetchBaseQueryError;
  let data=err.data as messageResponse;
  toast.error(data.message);
 }

 const {data ,  isLoading , isError , error  }= useSearchProductsQuery(filters);

 if ( isError ){
  let err = error as FetchBaseQueryError;
  let data=err.data as messageResponse;
  toast.error(data.message);
 }


  return(
    <div className="search-product-box">

      <aside>

        <h2>FILTERS</h2>

        <h4>Sort</h4>
        <select name="sort" value={filters.sort} onChange={(e)=>setFilters({...filters , sort:e.target.value , page:1 })}>
        <option value={undefined}>None</option>
        <option value="asc">ascending</option>
        <option value="desc">descending</option>
        </select>


        <h4 id="maxpricefilter">Max Price: {filters.maxPrice}</h4>
    <input type="range" min={1} max={100000} value={filters.maxPrice} onChange={(e)=>setFilters({...filters , maxPrice:Number(e.target.value),page:1 })}/>

        <h4>Category</h4>
        <select name="category" value={filters.category} onChange={ (e)=>setFilters({...filters , category:e.target.value,page:1 })}>
        <option value={""}>All</option>
       {
        categoryData?.categories.map((category , index)=>(
          <option key={index} value={`${category}`}>{`${category}`}</option>
        ))
       }
        </select>
      </aside>
      <main>

        <h1>PRODUCTS</h1>
        <input type="text" placeholder="Search by name..." value={filters.name} onChange={(e)=>setFilters({...filters , name:e.target.value ,page:1})}/>

        {isLoading ?<Skeleton/>:(<section className="search-products">
        {

           data?.pagedproducts.map( (item)=>(

             <ProductItem  key={item._id} _id={item._id} name={item.name} photo={item.photo}  price={item.price} stock={item.stock} />
           )
          )
        }
        </section>
        
        )}

        {
       data?.totalPages&&   data?.totalPages>1 ? (
            <article>
          <button disabled={filters.page==1} style={filters.page==1?{opacity:"0.5",cursor:"no-drop"}:{}} onClick={()=>setFilters({...filters ,page:filters.page-1})}>Prev</button>
          {filters.page} of {data?.totalPages}
      <button disabled={filters.page==data?.totalPages} style={filters.page==data?.totalPages?{opacity:"0.5" ,cursor:"no-drop"}:{} }  onClick={()=>setFilters({...filters ,page:filters.page+1})}>Next</button>
        </article>
          ):""
        }

      </main>
      
    </div>
  )
}

export default Search