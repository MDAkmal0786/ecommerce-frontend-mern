
import { Link, useLocation, useNavigate } from "react-router-dom";


import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import toast from "react-hot-toast";
import { useGetAOrderQuery } from "../redux/api/orderApi";
import { messageResponse } from "../types/api-types";
import { Skeleton } from "../components/Loader";



  

  


const OrderDetails = () => {
  let location = useLocation() ;
   
   let navigate = useNavigate();
 let orderId= location.pathname.split('/').pop() ;

  
  const { data ,  isLoading , isError , error }= useGetAOrderQuery(orderId!);

  if ( isError){
   let err = error as FetchBaseQueryError;
         let mssg = err.data as messageResponse;

         toast.error(mssg.message);
         navigate("/404");
  }
   



  
 

  return     isLoading?<Skeleton/>:(<main className="product-management">
          <section
            style={{
              padding: "2rem",
            }}
          >
            <h2>Order Items</h2>
  
            {data?.order.orderItems.map((i) => (
              <ProductCard
                key={i._id}
                name={i.name}
                photo={i.photo}
                _id={i._id}
                quantity={i.quantity}
                price={i.price}
              />
            ))}
          </section>
  
          <article className="shipping-info-card">
          
            <h1>Order Info</h1>
            <h5>User Info</h5>
            <p>Name: {data?.order.user.name}</p>
            <p>
              Address: {`${data?.order.shippingInfo.adress}, ${data?.order.shippingInfo.city}, ${data?.order.shippingInfo.state}, ${data?.order.shippingInfo.country} ${data?.order.shippingInfo.pinCode}`}
            </p>
            <h5>Amount Info</h5>
            <p>Subtotal: {data?.order.subTotal}</p>
            <p>Shipping Charges: {data?.order.shippingCharges}</p>
            <p>Tax: {data?.order.tax}</p>
            <p>Discount: {data?.order.discount}</p>
            <p>Total: {data?.order.total}</p>
  
            <h5>Status Info</h5>
            <p>
              Status:{" "}
              <span style={data?.order.status==="Processing"?{color:"red"}:data?.order.status==="Shipped"?{color:"blue"}:{color:"green"}}>
                {data?.order.status}
              </span>
            </p>
          </article>
        </main>)  
};


export interface orderItem{
  name:string,
  photo:string,
  price:number,
  quantity:number,
  _id:string
}

const ProductCard = ({
  name,
  photo,
  price,
  quantity,
  _id
}: orderItem) => (
  <div className="transaction-product-card">
    <img src={photo} alt={name} />
    <Link to={`/product/${_id}`}>{name}</Link>
    <span>
      ₹{price} X {quantity} = ₹{price * quantity}
    </span>
  </div>
);

export default OrderDetails;
