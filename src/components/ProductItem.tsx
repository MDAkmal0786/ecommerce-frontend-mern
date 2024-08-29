import { FaPlus } from "react-icons/fa"
import { useDispatch } from "react-redux"
import { addAProduct } from "../redux/reducers/cartReducer";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { MdOpenInFull } from "react-icons/md";


export interface productItemDataType {
    _id:string,
    photo : string,
    name:string,
    price:number
    stock:number,
     
}

//let server="jbcc";



const ProductItem = ( {_id , photo , name , price , stock  } : productItemDataType ) => {

  const dispatch = useDispatch() ;
  let navigate = useNavigate() ;


  function addToCartHandler(){

      if ( stock < 1 ) {

        toast.error("product Out Of Stock"); 

      }
      else
      {
         dispatch ( addAProduct( { _id , photo , name , price , stock } ) ) ;
     
         toast.success("product added to cart");
    // dispatch an action
      }

}

  return (      
       
   <div className="product-item-box">                                       {/* img  eg :  uploads/cover.png */}
    <img src={photo} alt="product Item"/> {/* as image will be path of img stored in folder of backend*/ }
    <p>{name}</p>           {/* and /folder/path  is made static (not an api for backend) hence  we can access uploads directory directroy */ }      
    <h3>₹{price}</h3>                                            

    <div>

        <button onClick={addToCartHandler}><FaPlus/></button>
        <button style={{marginLeft:"1rem"}} onClick={()=>navigate(`/product/${_id}`)}><MdOpenInFull /></button>
    </div>


   </div>

  )
}

export default ProductItem