import { ReactElement, useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { Link } from "react-router-dom";
import { Column } from "react-table";
import AdminSidebar from "../../components/admin/AdminSidebar";
import TableHOC from "../../components/admin/TableHOC";
import { useAllProductsQuery } from "../../redux/api/productApi";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import toast from "react-hot-toast";
import { Skeleton } from "../../components/Loader";
import {  FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { messageResponse } from "../../types/api-types";

interface DataType {
  photo: ReactElement;
  name: string;
  price: number;
  stock: number;
  action: ReactElement;
}
const columns: Column<DataType>[] = [
  {
    Header: "Photo",
    accessor: "photo",
  },
  {
    Header: "Name",
    accessor: "name",
  },
  {
    Header: "Price",
    accessor: "price",
  },
  {
    Header: "Stock",
    accessor: "stock",
  },
  {
    Header: "Action",
    accessor: "action",
  },
];





const Products = () => {

  const user = useSelector((state:RootState)=>state.userReducer.user);

           const {data , isLoading  , isError , error}  = useAllProductsQuery(user?._id!);
           
           if (isError) { // error is fetchbasequeryerror --->>  error:{status , data}
            let err = error as FetchBaseQueryError;
            let mssg = err.data as messageResponse

            toast.error(mssg.message);
           }

         const [rows  , setRows] = useState<DataType[]>([]) ;  // make a state as we need another arr mapped version od product[]
                                                              // we cannot random varibales in react so state
         useEffect(() => {
           
             data && setRows(
                 data.products.map((item)=>({
                       name:item.name ,
                        stock:item.stock,
                        price : item.price,
                        photo:<img src={item.photo}/>,
                        action:<Link to={`/admin/product/${item._id}`}>manage</Link>
                 }))  
              );
           
         }, [data])
         


          
     

  const Table = TableHOC<DataType> (
    columns,
   rows,
    "dashboard-product-box",
    "Products",
    rows.length > 6
  )();

  return (
    <div className="admin-container">
      <AdminSidebar />
      {
        isLoading?<Skeleton/>:(<>
          <main>{Table}</main>
      <Link to="/admin/product/new" className="create-product-btn">
        <FaPlus />
      </Link>
      </>
        )
      }
    </div>
  );
};

export default Products;
