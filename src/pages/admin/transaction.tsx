import { ReactElement, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Column } from "react-table";
import AdminSidebar from "../../components/admin/AdminSidebar";
import TableHOC from "../../components/admin/TableHOC";
import toast from "react-hot-toast";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { messageResponse } from "../../types/api-types";
import { useGetAllOrdersQuery } from "../../redux/api/orderApi";
import { RootState } from "../../redux/store";
import { useSelector } from "react-redux";
import { Skeleton } from "../../components/Loader";

interface DataType {
  name: string;
  amount: number;
  discount: number;
  quantity: number;
  status: ReactElement;
  action: ReactElement;
}



const columns: Column<DataType>[] = [
  {
    Header: "Name",
    accessor: "name",
  },
  {
    Header: "Amount",
    accessor: "amount",
  },
  {
    Header: "Discount",
    accessor: "discount",
  },
  {
    Header: "Quantity",
    accessor: "quantity",
  },
  {
    Header: "Status",
    accessor: "status",
  },
  {
    Header: "Action",
    accessor: "action",
  },
];

const Transaction = () => {



  const user= useSelector((state:RootState)=>state.userReducer.user)


  const { data ,  isLoading , isError , error }= useGetAllOrdersQuery(user?._id!);

  if ( isError){
   let err = error as FetchBaseQueryError;
         let mssg = err.data as messageResponse

         toast.error(mssg.message);
  }

  


  const [rows, setRows] = useState<DataType[]>([]);

  useEffect(()=>{

    let newData = data?.orders.map((order)=>({
      name:order.user?.name,
      discount:order.discount,
      amount:order.total,
      quantity:order.orderItems.length,
       status:<span style={order.status==="Processing"?{color:"red"}:order.status==="Shipped"?{color:"blue"}:{color:"green"}}>{order.status}</span>,
       action:<Link to={`/admin/transaction/${order._id}`}>View</Link>
    }) )


    newData  && setRows( newData) ;

  },[data]);





  const Table = TableHOC<DataType>(
    columns,
    rows,
    "dashboard-product-box",
    "Transactions",
    rows.length > 6
  );
  return(
    <div className="admin-container">
      <AdminSidebar />
      {
         isLoading?<Skeleton/>:<main><Table/></main>
      }
      
    </div>
  );
};

export default Transaction;
