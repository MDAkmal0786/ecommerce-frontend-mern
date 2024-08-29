import { FormEvent, useState } from "react";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import { useNewCouponMutation } from "../../../redux/api/couponApi";
import { RootState } from "../../../redux/store";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { messageResponse } from "../../../types/api-types";
import { useNavigate } from "react-router-dom";

const NewCoupon = () => {

    let [code , setCode ]=useState("");
    let [amount , setAmount]=useState(100); 
    let navigate = useNavigate();
    const user = useSelector((state:RootState)=>state.userReducer.user);


    let[newCoupon] = useNewCouponMutation();


  async  function formSubmitHandler(e:FormEvent<HTMLFormElement>){
e.preventDefault();

        let res = await newCoupon({userId:user?._id! , code , amount});
        if ( "data" in res){
            toast.success(res.data?.message!);
          navigate("/admin/app/coupon/create");
          }
          else{
        
           let err = res.error as FetchBaseQueryError;
           const data = err.data as messageResponse;
           toast.error(data.message);
        
          }


    }
  return (
    <div className="admin-container">
      <AdminSidebar />
      <main className="product-management">
        <article>
          <form onSubmit={formSubmitHandler}>
            <h2>New Coupon</h2>
            <div>
              <label>Code</label>
              <input
                type="text"
                placeholder="code"
                required
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />
            </div>
            <div>
              <label>Amount</label>
              <input
                type="number"
                placeholder="amount"
                required
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
              />
            </div>
            
            
            <button type="submit">Create </button>
          </form>
        </article>
      </main>
    </div>
  );
}

export default NewCoupon