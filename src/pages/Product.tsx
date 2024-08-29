import { useLocation, useNavigate } from "react-router-dom";
import { useGetAProductQuery } from "../redux/api/productApi";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { messageResponse } from "../types/api-types";
import toast from "react-hot-toast";
import { Skeleton } from "../components/Loader";
import { addAProduct } from "../redux/reducers/cartReducer";
import { useDispatch } from "react-redux";

const Product = () => {
    let location= useLocation();
  let navigate = useNavigate();
  const dispatch = useDispatch() ;

  let productId = location.pathname.split('/').pop();


  

  const{data , isError , error ,isLoading} = useGetAProductQuery(productId!) ;
  

  if(isError){
    const err = error as FetchBaseQueryError;
    const data = err.data as messageResponse;
    toast.error(data.message);
     navigate("/404");

  }
  const product = data?.product;

 
 


  function addToCartHandler(){

      if ( product?.stock! < 1 ) {

        toast.error("product Out Of Stock"); 

      }
      else
      {
         dispatch ( addAProduct( { _id:product?._id! ,photo: product?.photo! , name:product?.name! ,price: product?.price! ,stock: product?.stock! } ) ) ;
     
         toast.success("product added to cart");
    // dispatch an action
      }

}
  
 
  return isLoading?<Skeleton/>:(
    <main className="product-management">
        <section>
          <p style={{fontSize:"x-large"}}>{product?.category}</p>
          <img src={product?.photo} alt="Product" />
          <p>{product?.name}</p>
          {product?.stock ? (
            <span className="green">{product?.stock} Available</span>
          ) : (
            <span className="red"> Not Available</span>
          )}
          <h3>₹{product?.price}</h3>
          <strong style={{position:"absolute", top:"1rem" , left:"1rem"}}>{product?._id}</strong>
          <button style={{ cursor:"pointer" , marginTop:"1rem" , padding:"1rem" , borderRadius:"10px", border:"none"  , backgroundColor:"#0073FF" , color:"white"}}  onClick={addToCartHandler} >ADD TO CART</button>
        </section>
        
        </main>
        
  )
}

export default Product