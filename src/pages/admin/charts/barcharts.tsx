import { useSelector } from "react-redux";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import { BarChart } from "../../../components/admin/Charts";
import { RootState } from "../../../redux/store";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { messageResponse } from "../../../types/api-types";
import { useBarQuery } from "../../../redux/api/statsApi";
import toast from "react-hot-toast";
import { Skeleton } from "../../../components/Loader";
import { pastMonths } from "../../../feautres";

let sixMonths=pastMonths(6)
let twelveMonths=pastMonths(12)

const Barcharts = () => {

  const user = useSelector((state:RootState)=>state.userReducer.user);
  const { data  ,isLoading  , isError , error}  = useBarQuery(user?._id!);
  
  if (isError) { // error is fetchbasequeryerror --->>  error:{status , data}
   let err = error as FetchBaseQueryError;
   let mssg = err.data as messageResponse;

   toast.error(mssg.message);
  }

  
  return (
    <div className="admin-container">
      <AdminSidebar />{
     isLoading?<Skeleton/>: (<main className="chart-container">
        <h1>Bar Charts</h1>
        <section>
          <BarChart
            data_1={data?.bar.SixMonthsProductAndUsers.Products!}
            data_2={data?.bar.SixMonthsProductAndUsers.users!}
            title_1="Products"
            title_2="Users"
            bgColor_1={`hsl(260, 50%, 30%)`}
            bgColor_2={`hsl(360, 90%, 90%)`}
            labels={sixMonths}
          />
          <h2>Top Products & Top Customers</h2>
        </section>

        <section>
          <BarChart
            horizontal={true}
            data_1={data?.bar.orderThorughoutYear!}
            data_2={[]}
            title_1="Orders"
            title_2=""
            bgColor_1={`hsl(180, 40%, 50%)`}
            bgColor_2=""
            labels={twelveMonths}
          />
          <h2>Orders throughout the year</h2>
        </section>
      </main>)
}
    </div>
  );
};

export default Barcharts;
