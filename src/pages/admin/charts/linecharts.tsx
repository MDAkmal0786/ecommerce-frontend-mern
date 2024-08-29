import { useSelector } from "react-redux";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import { LineChart } from "../../../components/admin/Charts";
import { RootState } from "../../../redux/store";
import { useLineQuery } from "../../../redux/api/statsApi";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { messageResponse } from "../../../types/api-types";
import toast from "react-hot-toast";
import { Skeleton } from "../../../components/Loader";
import { pastMonths } from "../../../feautres";


let twelveMonths=pastMonths(12)

const Linecharts = () => {

  const user = useSelector((state:RootState)=>state.userReducer.user);
  const { data  ,isLoading  , isError , error}  = useLineQuery(user?._id!);
  
  if (isError) { // error is fetchbasequeryerror --->>  error:{status , data}
   let err = error as FetchBaseQueryError;
   let mssg = err.data as messageResponse;

   toast.error(mssg.message);
  }

  return (
    <div className="admin-container">
      <AdminSidebar />{
     isLoading?<Skeleton/>: (<main className="chart-container">
        <h1>Line Charts</h1>
        <section>
          <LineChart
            data={data?.line.OneYearAcitveUsers!}
            label="Users"
            borderColor="rgb(53, 162, 255)"
            labels={twelveMonths}
            backgroundColor="rgba(53, 162, 255, 0.5)"
          />
          <h2>Active Users</h2>
        </section>

        <section>
          <LineChart
            data={data?.line.OneYearProducts!}
            backgroundColor={"hsla(269,80%,40%,0.4)"}
            borderColor={"hsl(269,80%,40%)"}
            labels={twelveMonths}
            label="Products"
          />
          <h2>Total Products (SKU)</h2>
        </section>

        <section>
          <LineChart
            data={data?.line.OneYearRevenue!}
            backgroundColor={"hsla(129,80%,40%,0.4)"}
            borderColor={"hsl(129,80%,40%)"}
            label="Revenue"
            labels={twelveMonths}
          />
          <h2>Total Revenue </h2>
        </section>

        <section>
          <LineChart
            data={data?.line.OneYearDiscount!}
            backgroundColor={"hsla(29,80%,40%,0.4)"}
            borderColor={"hsl(29,80%,40%)"}
            label="Discount"
            labels={twelveMonths}
          />
          <h2>Discount Allotted </h2>
        </section>
      </main>
      )}
    </div>
  );
};

export default Linecharts;
