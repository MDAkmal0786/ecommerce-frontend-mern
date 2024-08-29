import { FaTrash } from "react-icons/fa"
import { Link } from "react-router-dom"
import { deleteAProduct, updateQuantity } from "../redux/reducers/cartReducer"
import { useDispatch } from "react-redux"
import toast from "react-hot-toast"
import { useEffect, useState } from "react"

interface cartItemDataType{
   productId :string,
   img : string,
   name:string,
   price:number,
   quantity:number,
   stock:number

}

const CardItem = ( {productId , img , name , price , quantity , stock }:cartItemDataType ) => {

  let [count , setCount]=useState<number>(quantity) ;

 const dispatch = useDispatch() ;



 useEffect(
  ()=>{

    dispatch(updateQuantity( {id:productId , quantity:count , price:price} ))

  },
  [count]
 )

  function deleteCartProduct(){
     
       dispatch(deleteAProduct({id:productId , price:price , quantity:quantity}));
       toast.success("product deleted from cart");

  }

  return (
    <div className="cart-list">

      <img src={img} alt={name}/>

      <article >
        <Link to={`/product/${productId}`}><p>{name}</p></Link>
        <h3>₹{price}</h3>
      </article>
      
      <div className="cart-buttons">

        <button disabled={count==1} style={count==1?{cursor:"no-drop"}:{}} id="quantity-buttons" onClick={()=>setCount(count-1)}>-</button>
        {count}
        <button disabled={count==stock} style={count==stock?{cursor:"no-drop"}:{}} id="quantity-buttons"  onClick={()=>setCount(count+1)}>+</button>

        <button onClick={deleteCartProduct} className="trash"><FaTrash/></button>
      </div>

      
      
    </div>
  )
}

export default CardItem