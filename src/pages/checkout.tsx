import { Elements, PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"

import { FormEvent, useState } from "react";
import toast from "react-hot-toast";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useNewOrderMutation } from "../redux/api/orderApi";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { messageResponse } from "../types/api-types";
import { ChangeIsRefetch, resetCart } from "../redux/reducers/cartReducer";



  const stripePromise = loadStripe(
    "pk_test_51PhENdRxjWYc0tDGgzFE3Vq0jvEERVMJ6OUvy8wHH6Mff2hNAxsnnZT6vk2cILzIaj2JrowsJ1lFA4nfD0fpS5Vn00S89BMpuU"
  );  
  // publishable key of ur account



 const CheckoutForm= ()=>{
  let [newOrder] = useNewOrderMutation();
  let navigate = useNavigate();
  const stripe = useStripe();
  const elements = useElements(); 
  let dispatch = useDispatch();

  const {user} = useSelector((state:RootState)=>state.userReducer);
  const {products , shippingInfo,subTotal , shippingCharges , tax , discount , total} = useSelector((state:RootState)=>state.cartReducer)

    const [isProcessing , setIsProcessing] = useState<boolean> (false) ;

   


   async function submitHandler( e:FormEvent<HTMLFormElement> ) {

      e.preventDefault();
      if ( !stripe || !elements) return;    // making sure elements are   t h e r e

      setIsProcessing(true);

 const {paymentIntent , error} =   await stripe.confirmPayment({
        elements,// all card details
        confirmParams:{return_url:window.location.origin}, // come to this url back after confirmation
        redirect:"if_required"

      });


      if (error){
        setIsProcessing(false);
        return toast.error(error.message || "Something went Wrong")
      }
   if ( paymentIntent.status==="succeeded"){

          // cretae order + removw cart as its quantity are SOLDOUT
          const res =  await  newOrder({
            user:user?._id!,
             orderItems:products,
            shippingInfo,
            subTotal,
            tax,
            shippingCharges,
            discount,
            total,
          });
          if("data" in res){
              toast.success(res.data?.message!);
              dispatch( resetCart() ) ;
              dispatch( ChangeIsRefetch() ) ;
              navigate("/orders");
          }
          else{
               let err = res.error as FetchBaseQueryError;
               let data = err.data as messageResponse;
               toast.error(data.message) ;
          }

          
       
   }

   setIsProcessing(false);

      
    }
    return (    
        <div className="checkout-box">

            <form onSubmit={submitHandler}>
                <PaymentElement/>
                <button style={isProcessing?{cursor:"no-drop"}:{}} disabled={isProcessing} type="submit">{isProcessing?"Processing...":"Pay"}</button>
            </form>

        </div>
    )
}
const Checkout = () => {

  const location = useLocation() ;

  let clientSecret:string|undefined = location.state;
  if ( !clientSecret){
    return <Navigate to={"/shipping"}/> 
  }
  return (
    <Elements stripe={stripePromise} options={{clientSecret}}> {/*wrapper for checkout form  pass publishable key   .. clientSecret */}
        <CheckoutForm/>
    </Elements>
  )
}

export default Checkout