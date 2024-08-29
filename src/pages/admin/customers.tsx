import { ReactElement, useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";
import { Column } from "react-table";
import AdminSidebar from "../../components/admin/AdminSidebar";
import TableHOC from "../../components/admin/TableHOC";
import { useAllUserQuery, useDeleteUserMutation, useUpdateUserMutation } from "../../redux/api/userApi";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { messageResponse } from "../../types/api-types";
import toast from "react-hot-toast";
import { Skeleton } from "../../components/Loader";
import { ChangeDetectToken } from "../../redux/reducers/userReducer";

interface DataType {
  photo: ReactElement;
  name: string;
  email: string;
  gender: string;
  role: ReactElement;
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
    Header: "Gender",
    accessor: "gender",
  },
  {
    Header: "Email",
    accessor: "email",
  },
  {
    Header: "Role",
    accessor: "role",
  },
  {
    Header: "Action",
    accessor: "action",
  },
];



const Customers = () => {


  const user = useSelector((state:RootState)=>state.userReducer.user);
  let dispatch = useDispatch();
  let[deleteUser] = useDeleteUserMutation() ;
  let[upadateUser] = useUpdateUserMutation();

           const {data , isLoading  , isError , error}  = useAllUserQuery(user?._id!) ;
           
           if (isError) { // error is fetchbasequeryerror --->>  error:{status , data}
            let err = error as FetchBaseQueryError;
            let mssg = err.data as messageResponse

            toast.error(mssg.message);
           }

         
       
  const [rows, setRows] = useState<DataType[]>([]);


  async function deleteHandler(userId:string) {
    
    let res = await deleteUser({userId , currentUserId:user?._id!});
    
    if ( "data" in res){
      toast.success(res.data?.message!);

      dispatch(ChangeDetectToken(true));  // to reset user state  
      
    }
    else{
 
     let err = res.error as FetchBaseQueryError;
     const data = err.data as messageResponse;
     toast.error(data.message);
 
    }
  }
 async function updateHandler(userId:string){

    const res = await upadateUser({userId , currentUserId:user?._id!});
    if ( "data" in res){
      toast.success(res.data?.message!);
      dispatch(ChangeDetectToken(true));
      
    }
    else{
 
     let err = res.error as FetchBaseQueryError;
     const data = err.data as messageResponse;
     toast.error(data.message);
 
    }
        
  }



  useEffect(()=>{

   data && setRows(data?.users.map((user)=>({
      photo: (
        <img
          style={{
            borderRadius: "50%",
          }}
          src={user.photo}
          alt={user.name}
        />
      ),
      name: user.name,
      email: user.email,
      gender: user.gender,
      role: (<button onClick={()=>{updateHandler(user._id)}} style={user.role=="user"?{color:"blue"}:{color:"red"}}>{user.role}</button>),
      action: (
        <button onClick={()=>{deleteHandler(user._id)}}>
          <FaTrash />
        </button>
      ),

    })))

  } , [data]);









  const Table = TableHOC<DataType>(
    columns,
    rows,
    "dashboard-product-box",
    "Customers",
    rows.length > 6
  );

  return (
    <div className="admin-container">
      <AdminSidebar />
     { isLoading?<Skeleton/>:(<main><Table/></main>)}
    </div>
  );
};

export default Customers;
