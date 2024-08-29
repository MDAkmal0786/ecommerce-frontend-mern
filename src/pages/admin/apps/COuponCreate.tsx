import { Link } from "react-router-dom";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import { FaPlus, FaTrash } from "react-icons/fa";
import { Skeleton } from "../../../components/Loader";
import TableHOC from "../../../components/admin/TableHOC";
import { Column } from "react-table";
import { ReactElement, useEffect, useState } from "react";
import { useAllCouponQuery, useDeleteCouponMutation } from "../../../redux/api/couponApi";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { messageResponse } from "../../../types/api-types";
import toast from "react-hot-toast";

 interface DataType{
  code:string,
  amount: number,
  delete:ReactElement

}
const columns: Column<DataType>[] = [
  {
    Header: "Code",
    accessor: "code",
  },
  {
    Header: "Amount",
    accessor: "amount",
  },
  {
    Header: "Delete",
    accessor: "delete",
  },
];



const COuponCreate = () => {


    
  const user = useSelector((state:RootState)=>state.userReducer.user);
  let[deleteCoupon] = useDeleteCouponMutation();

  const {data , isLoading  , isError , error}  = useAllCouponQuery(user?._id!);
  
  
  if (isError) { // error is fetchbasequeryerror --->>  error:{status , data}
   let err = error as FetchBaseQueryError;
   let mssg = err.data as messageResponse

   toast.error(mssg.message);
  }

  async function deleteHandler(couponId:string){

   let res = await deleteCoupon({couponId , currentUserId:user?._id!})

   if ( "data" in res){
    toast.success(res.data?.message!);

  }
  else{

   let err = res.error as FetchBaseQueryError;
   const data = err.data as messageResponse;
   toast.error(data.message);

  }


  }

  const [rows  , setRows] = useState<DataType[]>([]) ;  // make a state as we need another arr mapped version od product[]
                                                              // we cannot random varibales in react so state
         useEffect(() => {
           
             data && setRows(
                 data.coupons.map((item)=>({
                       code:item.code,
                       amount:item.amount,
                       delete:<button onClick={()=>deleteHandler(item._id)}><FaTrash /></button>
                 }))  
              );
           
         }, [data])

  const Table = TableHOC<DataType> (
    columns,
   rows,
    "dashboard-product-box",
    "Coupons",
  //  rows.length > 6
  );
  return  (
    <div className="admin-container">
      <AdminSidebar />
      {
      isLoading?<Skeleton/>: (<>
          <main><Table/></main>
      <Link to="/admin/app/coupon/new" className="create-product-btn">
        <FaPlus />
      </Link>
      </>
        )
      }
    </div>
  );
}

export default COuponCreate