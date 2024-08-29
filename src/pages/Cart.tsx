
import { useEffect, useState } from "react";
import { ImCancelCircle } from "react-icons/im";
import {  useNavigate } from "react-router-dom";
import CardItem from "../components/CardItem";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import axios from "axios";
import { addDiscount } from "../redux/reducers/cartReducer";






const Cart = () => {

  let navigate = useNavigate();
  let dispatch = useDispatch();


 const { products , subTotal , total , tax , discount , shippingCharges}= useSelector((state:RootState)=> state.cartReducer)

     //   map cart reducer in cart page number of products + their financila charges

  let [coupen , setCoupen] = useState<string> ("");
  let [validateCoupen , setvalidateCoupen] =useState<boolean> (false);

  useEffect( () => {  // debouncer + updater

    const {cancel , token} = axios.CancelToken.source();  

   let a = setTimeout( ()=> {

    axios.get(`${import.meta.env.VITE_SERVER}/api/v1/payment/discount?code=${coupen}` , {cancelToken:token}).then((res)=>{

     // console.log(res.data.amount);
     dispatch(addDiscount(res.data.amount));
     setvalidateCoupen(true);

       
    }).catch(()=>{
     // console.log(error.response.data.message) ;
     setvalidateCoupen(false);
     dispatch(addDiscount(0));
    })
    } , 1000 );
    return () => {
     
      clearTimeout( a ) ; // debouncing only last prevailed for 1sec req will be validated otherwise clear and setfalse
      cancel();
    }
  } ,
 [coupen] 
) ;
  
  return  products.length>0 ?(
    <div className="cart-box">

      <main>

        {
         
            products.map((item)=>(
              <CardItem key={item._id}  productId={item._id} img={item.photo} name={item.name} price={item.price} quantity={item.quantity} stock={item.stock}/>

            )

          )
        }
        
      </main>
      <aside>
        <p>Subtotal: ₹{subTotal}</p>
        <p>Shipping Charges: ₹{shippingCharges}</p>
        <p>Tax: ₹{tax}</p>
        <p>Discount: <em style={{color:"red"}}>-₹{discount}</em></p>
        <h3>Total: ₹{total}</h3>

        <input type="text" value={coupen} placeholder="Coupen Code" onChange={(e)=>setCoupen(e.target.value)}/>
        {
          coupen &&( validateCoupen? <div style={{color:"green"}}>₹{discount} off using the <code>{coupen}</code></div>:<div style={{color:"red"}}>Invalid Coupen <span><ImCancelCircle /></span></div>

          )
        }
        {
          products.length>0 && <button id="checkout-cart" onClick={()=>{navigate("/shipping")}}>CHECKOUT</button>
        }
      </aside>
      
    </div>
  ):<h1 id="noCartitem"> CART IS EMPTY</h1>
}

export default Cart