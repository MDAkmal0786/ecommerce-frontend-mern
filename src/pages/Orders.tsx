import  { ReactElement, useEffect, useState } from "react"
import { Column } from "react-table"
import TableHOC from "../components/admin/TableHOC"
import { Link } from "react-router-dom"
import { useGetMyOrdersQuery } from "../redux/api/orderApi"
import { useSelector } from "react-redux"
import { RootState } from "../redux/store"
import { Skeleton } from "../components/Loader"
import toast from "react-hot-toast"
import { FetchBaseQueryError } from "@reduxjs/toolkit/query"
import { messageResponse } from "../types/api-types"

interface OrderDataType{
  id:string,
  quantity:number,
  discount:number,
  amount:number,
  status : ReactElement,
  action:ReactElement

}


let columns:Column<OrderDataType>[]=[
  {
    Header:"Id",
    accessor:"id"
  },
  {
    Header:"Quantity",
    accessor:"quantity"
  },
  {
    Header:"Discount",
    accessor:"discount"
  },
  {
    Header:"Amount",
    accessor:"amount"
  },
  {
    Header:"Status",
    accessor:"status"
  },
  {
    Header:"Action",
    accessor:"action"
  },
]

const Orders = () => {

 const user= useSelector((state:RootState)=>state.userReducer.user)


     const {data ,  isLoading , isError , error}= useGetMyOrdersQuery(user?._id!);

     if ( isError){
      let err = error as FetchBaseQueryError;
            let mssg = err.data as messageResponse

            toast.error(mssg.message);
     }

     

     let [arr , setArr] = useState<OrderDataType[]>([]) ;


     useEffect(() => {

       data && setArr(data.orders.map((order)=>({
        id:order._id,
        discount:order.discount,
        amount:order.total,
        quantity:order.orderItems.length,
         status:<span style={order.status==="Processing"?{color:"red"}:order.status==="Shipped"?{color:"blue"}:{color:"green"}}>{order.status}</span>,
         action:<Link to={`/orders/${order._id}`}>View</Link>
      }) ) ) ;       
     }, [data])
     

     
const Res=TableHOC<OrderDataType>(    //   javascript way of calling components by  f u n c t i o n s
  columns,
  arr!,
  "order-table-class",
  "ORDERS",
  arr.length > 6,
  );

  return isLoading?<Skeleton/>:(
    <div className="orders-box">

        <h1>MY ORDERS</h1>

        {/* TABLE */}

       <Res/>

    </div>
  )
}

export default Orders