
import { BiMaleFemale } from "react-icons/bi";
import { BsSearch } from "react-icons/bs";
import { FaRegBell } from "react-icons/fa";
import { HiTrendingDown, HiTrendingUp } from "react-icons/hi";

import AdminSidebar from "../../components/admin/AdminSidebar";
import { BarChart, DoughnutChart } from "../../components/admin/Charts";
import Table from "../../components/admin/DashboardTable";

import { useStatsQuery } from "../../redux/api/statsApi";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { messageResponse } from "../../types/api-types";
import toast from "react-hot-toast";
import { Skeleton } from "../../components/Loader";
import { pastMonths } from "../../feautres";

let sixMonths=pastMonths(6)
 
const Dashboard = () => {



  const user = useSelector((state:RootState)=>state.userReducer.user);

  const { data  ,isLoading  , isError , error}  = useStatsQuery(user?._id!);
  
  if (isError) { // error is fetchbasequeryerror --->>  error:{status , data}
   let err = error as FetchBaseQueryError;
   let mssg = err.data as messageResponse

   toast.error(mssg.message);
  }

 

  return (
    <div className="admin-container">
      <AdminSidebar />
      {isLoading?<Skeleton/>:(<main className="dashboard">
        <div className="bar">
          <BsSearch />
          <input type="text" placeholder="Search for data, users, docs" />
          <FaRegBell />
          <img src={user?.photo} alt="User" />
        </div>

        <section className="widget-container">
          <WidgetItem
            percent={data?.stats.percentChange.revenue!}
            amount={true}
            value={data?.stats.count.revenue!}
            heading="Revenue"
            color="rgb(0, 115, 255)"
          />
          <WidgetItem
            percent={data?.stats.percentChange.user!}
            value={data?.stats.count.user!}
            color="rgb(0 198 202)"
            heading="Users"
          />
          <WidgetItem
            percent={data?.stats.percentChange.transaction!}
            value={data?.stats.count.transaction!}
            color="rgb(255 196 0)"
            heading="Transactions"
          />

          <WidgetItem
            percent={data?.stats.percentChange.product!}
            value={data?.stats.count.product!}
            color="rgb(76 0 255)"
            heading="Products"
          />
        </section>

        <section className="graph-container">
          <div className="revenue-chart">
            <h2>Revenue & Transaction</h2>
            <BarChart
              data_1={data?.stats.chart.revenue!}
              data_2={data?.stats.chart.order!}
              title_1="Revenue"
              title_2="Transaction"
              bgColor_1="rgb(0, 115, 255)"
              bgColor_2="rgba(53, 162, 235, 0.8)"
              labels={sixMonths}
            />
          </div>

          <div className="dashboard-categories">
            <h2>Inventory</h2>

            <div>
              {data?.stats.categoryCount.map((i , index) => {
              
              for ( const key in i){
                   return   <CategoryItem
                   key={index}
                   value={i[key]}
                   heading={key}
                   color={`hsl(${i[key] * 20}, ${i[key]}%, 50%)`}
                 />
              }
})}
            </div>
          </div>
        </section>

        <section className="transaction-container">
          <div className="gender-chart">
            <h2>Gender Ratio</h2>
            <DoughnutChart
              labels={["Female", "Male"]}
              data={[data?.stats.userRatio.female!,data?.stats.userRatio.male! ]}
              backgroundColor={[
                "hsl(340, 82%, 56%)",
                "rgba(53, 162, 235, 0.8)",
              ]}
              cutout={90}
            />
            <p>
              <BiMaleFemale />
            </p>
          </div>
          <Table data={data?.stats.topFourOrders!} />
        </section>
      </main>)}
    </div>
  );
};

interface WidgetItemProps {
  heading: string;
  value: number;
  percent: number;
  color: string;
  amount?: boolean;
}

const WidgetItem = ({
  heading,
  value,
  percent,
  color,
  amount = false,
}: WidgetItemProps) => {

   let newPercent = percent > 1000 ? 999 : percent;

  return <article className="widget">
    <div className="widget-info">
      <p>{heading}</p>
      <h3>{amount ? `₹${value}` : value}</h3>
      {newPercent > 0 ? (
        <span className="green">
          <HiTrendingUp /> +{newPercent}%{" "}
        </span>
      ) : (
        <span className="red">
          <HiTrendingDown /> {newPercent < -1000 ? -999 : newPercent}%{" "}
        </span>
      )}
    </div>

    <div
      className="widget-circle"
      style={{
        background: `conic-gradient(
        ${color} ${(Math.abs(percent) / 100) * 360}deg,
        rgb(255, 255, 255) 0
      )`,
    
      }}
    >
      <span
        style={{
          color,
        }}
      >
        {newPercent}%
      </span>
    </div>
  </article>
};

interface CategoryItemProps {
  color: string;
  value: number;
  heading: string;
}

const CategoryItem = ({ color, value, heading }: CategoryItemProps) => (
  <div className="category-item">
    <h5>{heading}</h5>
    <div>
      <div
        style={{
          backgroundColor: color,
          width: `${value}%`,
        }}
      ></div>
    </div>
    <span>{value}%</span>
  </div>
);

export default Dashboard;
