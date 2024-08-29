import { Link } from "react-router-dom"
import ProductItem from "../components/ProductItem"
import { useForceInvalidateMutation, useLatestProductQuery } from "../redux/api/productApi"
import { Skeleton} from "../components/Loader"
import toast from "react-hot-toast"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "../redux/store"
import { useEffect } from "react"
import { ChangeIsRefetch } from "../redux/reducers/cartReducer"


 


const Home = () => {

 const {data , isLoading , isError} = useLatestProductQuery("");
 
 let dispatch = useDispatch();
 let [forceInvalidate] = useForceInvalidateMutation();
 let {isRefetch} = useSelector((state:RootState)=>state.cartReducer)

 useEffect(()=>{

   if (isRefetch){

     dispatch( ChangeIsRefetch() ) ;//@ts-ignore
      forceInvalidate("").then((res)=>{  
      })
   }

 },[isRefetch]);

 if (isError) toast.error("product not fetched");
 
  return  isLoading? (<Skeleton/> ): (  // till fetch show skeleton
    <div className="home">
      <section></section>

      <div className="latestAndMore">
      <h1>LATEST PRODUCTS</h1>
      <Link to={"/search"} >MORE</Link>

      </div>

      <main className="product-list">
        { 
       data?.products.map((item)=>(
            <ProductItem key={item._id} _id={item._id} name={item.name} price={item.price} photo={item.photo} stock={item.stock} />
          ) )
        }

      </main>

    </div>
  )
}

export default Home