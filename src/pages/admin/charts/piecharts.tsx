import AdminSidebar from "../../../components/admin/AdminSidebar";
import { DoughnutChart, PieChart } from "../../../components/admin/Charts";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { usePieQuery } from "../../../redux/api/statsApi";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { messageResponse } from "../../../types/api-types";
import toast from "react-hot-toast";
import { Skeleton } from "../../../components/Loader";

const PieCharts = () => {


  const user = useSelector((state:RootState)=>state.userReducer.user);

  const { data  ,isLoading  , isError , error}  = usePieQuery(user?._id!);
  
  if (isError) { // error is fetchbasequeryerror --->>  error:{status , data}
   let err = error as FetchBaseQueryError;
   let mssg = err.data as messageResponse;

   toast.error(mssg.message);
  }
  

 
  
  return (
    <div className="admin-container">
      <AdminSidebar />{
     isLoading?<Skeleton/>: (<main className="chart-container">
        <h1>Pie & Doughnut Charts</h1>
        <section>
          <div>
            <PieChart
              labels={["Processing", "Shipped", "Delivered"]}
              data={[data?.pie.orderfullfillmentRatio.processing! , data?.pie.orderfullfillmentRatio.shipped! , data?.pie.orderfullfillmentRatio.delivered! ]}
              backgroundColor={[
                `hsl(110,80%, 80%)`,
                `hsl(110,80%, 50%)`,
                `hsl(110,40%, 50%)`,
              ]}
              offset={[0, 0, 50]}
            />
          </div>
          <h2>Order Fulfillment Ratio</h2>
        </section>

        <section>
          <div>
            <DoughnutChart
              labels={data?.pie.categoryObj.category!}
              data={data?.pie.categoryObj.count!} 
            backgroundColor={data?.pie.categoryObj.count.map(
              (i) => `hsl(${i * Math.random()*4}, ${i}%, 50%)`
            )!}
              legends={false}
              offset={[20, 20, 20, 80]}
            />
          </div>
          <h2>Product Categories Ratio</h2>
        </section>

        <section>
          <div>
            <DoughnutChart
              labels={["In Stock", "Out Of Stock"]}
              data={[data?.pie.stockRatio.inStock! , data?.pie.stockRatio.outOfStock!]}
              backgroundColor={["hsl(269,80%,40%)", "rgb(53, 162, 255)"]}
              legends={false}
              offset={[0, 80]}
              cutout={"70%"}
            />
          </div>
          <h2> Stock Availability</h2>
        </section>

        <section>
          <div>
            <DoughnutChart
              labels={[
                "Marketing Cost",
                "Discount",
                "Burnt",
                "Production Cost",
                "Net Margin",
              ]}
              data={[data?.pie.revenueDistribution.marketingCost! ,data?.pie.revenueDistribution.discount! , data?.pie.revenueDistribution.burnt!, data?.pie.revenueDistribution.productionCost! , data?.pie.revenueDistribution.netMargin!]}
              backgroundColor={[
                "hsl(110,80%,40%)",
                "hsl(19,80%,40%)",
                "hsl(69,80%,40%)",
                "hsl(300,80%,40%)",
                "rgb(53, 162, 255)",
              ]}
              legends={false}
              offset={[20, 30, 20, 30, 80]}
            />
          </div>
          <h2>Revenue Distribution</h2>
        </section>

        <section>
          <div>
            <PieChart
              labels={[
                "Teenager(Below 20)",
                "Adult (20-40)",
                "Older (above 40)",
              ]}
              data={[data?.pie.userAgeGroup.teenager! , data?.pie.userAgeGroup.adult! , data?.pie.userAgeGroup.older!]}
              backgroundColor={[
                `hsl(10, ${80}%, 80%)`,
                `hsl(10, ${80}%, 50%)`,
                `hsl(10, ${40}%, 50%)`,
              ]}
              offset={[0, 0, 50]}
            />
          </div>
          <h2>Users Age Group</h2>
        </section>

        <section>
          <div>
            <DoughnutChart
              labels={["Admin", "Customers"]}
              data={[data?.pie.adminCustomer.admin! , data?.pie.adminCustomer.user!]}
              backgroundColor={[`hsl(335, 100%, 38%)`, "hsl(44, 98%, 50%)"]}
              offset={[0, 50]}
            />
          </div>
        </section>
      </main>)
}
    </div>
  );
};

export default PieCharts;
