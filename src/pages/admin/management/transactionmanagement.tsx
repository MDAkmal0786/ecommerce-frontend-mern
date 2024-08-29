import { FaTrash } from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";
import AdminSidebar from "../../../components/admin/AdminSidebar";


import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { messageResponse } from "../../../types/api-types";
import toast from "react-hot-toast";
import { useGetAOrderQuery, useOrderDeleteMutation, useOrderUpdateMutation } from "../../../redux/api/orderApi";
import { Skeleton } from "../../../components/Loader" ;
import { RootState } from "../../../redux/store" ;
import { useSelector } from "react-redux" ;



  

  


const TransactionManagement = () => {
  let location = useLocation() ;
   let[orderDelete] = useOrderDeleteMutation() ;
   let[orderUpdate] = useOrderUpdateMutation();
   let navigate = useNavigate();
 let orderId= location.pathname.split('/').pop() ;
 const {user} = useSelector((state:RootState)=>state.userReducer);

  
  const { data ,  isLoading , isError , error }= useGetAOrderQuery(orderId!);

  if ( isError){
   let err = error as FetchBaseQueryError;
         let mssg = err.data as messageResponse;

         toast.error(mssg.message);
         navigate("/404");
  }
   



  
 async function deleteHandler()
  {
     const res =     await orderDelete({orderId:orderId! , userId:user?._id!});

     if("data" in res){
      toast.success(res.data?.message!);
     
      navigate("/admin/transaction");
  }
  else{
       let err = res.error as FetchBaseQueryError;
       let data = err.data as messageResponse;
       toast.error(data.message) ;
  }
  }
   const updateHandler = async ()=> {

    const res =     await orderUpdate({orderId:orderId! , userId:user?._id!});

    if("data" in res){
     toast.success(res.data?.message!);
    
   
 }
 else{
      let err = res.error as FetchBaseQueryError;
      let data = err.data as messageResponse;
      toast.error(data.message) ;
 }
    
  };

  return (
    <div className="admin-container">
      <AdminSidebar />
      {
        isLoading?<Skeleton/>:(<main className="product-management">
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
            <button className="product-delete-btn" onClick={deleteHandler}>
              <FaTrash />
            </button>
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
            <button className="shipping-btn" onClick={updateHandler }>
              Process Status
            </button>
          </article>
        </main>)
      }
    </div>
  );
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

export default TransactionManagement;
