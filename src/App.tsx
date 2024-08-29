import { lazy, Suspense, useEffect } from "react"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import {Loader} from "./components/Loader"
import Header from "./components/Header"
import  { Toaster } from "react-hot-toast"
import { onAuthStateChanged } from "firebase/auth"
import { auth } from "./firebase"
import { useDispatch, useSelector } from "react-redux"
import { ChangeDetectToken, userExist, userNotExist } from "./redux/reducers/userReducer"
import { getUser } from "./redux/api/userApi"
import { RootState } from "./redux/store"
import ProtectedRoute from "./components/ProtectedRoute"


let Home = lazy(()=>import("./pages/Home"))
let Search = lazy(()=>import("./pages/Search"))
let Cart = lazy(()=>import("./pages/Cart"))
let Product = lazy(()=>import("./pages/Product"))

//adimin
const Dashboard = lazy(() => import("./pages/admin/dashboard"));
const Products = lazy(() => import("./pages/admin/products"));
const Customers = lazy(() => import("./pages/admin/customers"));
const Transaction = lazy(() => import("./pages/admin/transaction"));
const Barcharts = lazy(() => import("./pages/admin/charts/barcharts"));
const Piecharts = lazy(() => import("./pages/admin/charts/piecharts"));
const Linecharts = lazy(() => import("./pages/admin/charts/linecharts")); 
const Coupon = lazy(() => import("./pages/admin/apps/coupon"));
const Stopwatch = lazy(() => import("./pages/admin/apps/stopwatch"));
const Toss = lazy(() => import("./pages/admin/apps/toss"));
const NewProduct = lazy(() => import("./pages/admin/management/newproduct"));
const ProductManagement = lazy(() => import("./pages/admin/management/productmanagement"));
const TransactionManagement = lazy(() => import("./pages/admin/management/transactionmanagement"));
const Shipping = lazy(() => import("./pages/Shipping"));
const Checkout = lazy(() => import("./pages/checkout"));
const Login = lazy(() => import("./pages/Login"));
const Orders = lazy(() => import("./pages/Orders"));
const OrderDetails = lazy(() => import("./pages/OrderDetails"));
const NotFound = lazy(() => import("./pages/NotFound"));
const COuponCreate=lazy(() => import("./pages/admin/apps/COuponCreate"));
const NewCoupon=lazy(() => import("./pages/admin/apps/NewCoupon"));

 // starter : add scss in main.tsx , make pages components + add routing in app.tsx--lazy import--suspense , 




const App = () => {

  const dispatch = useDispatch() ;
  let {loading , user , detectToken} = useSelector( (state:RootState)=>state.userReducer) ;
  

  useEffect( ( )=>{  // on first reload   {{. whenever reload  user state is accordingly to token or not for ===>> S I G N  I N   L O G I C   } }

   onAuthStateChanged( auth ,async (user)=>{  // it will bring current token = null | data of user associated in firebase
          if ( user ) {
             console.log( user.uid )
              const data = await getUser( user.uid ); // axios request to get dataa accrgdly to a ID
            if(data?.user){
              dispatch( userExist(data.user) ) ;
            }
            else{
               // when according token no user..  dleeted from user model  .. dispatch to avoid loader  
               console.log("notFound");
               dispatch( userNotExist() ) ;
            }
           
          } 
          else {

            dispatch( userNotExist() ) ;
             
          }
          if(detectToken){
            dispatch(ChangeDetectToken(false));
          }
   }  ) ;
    

  } , [detectToken] ) ;


  return loading ?(<Loader/>) : ( // till user = changes to  null / or user  show null
      <BrowserRouter>

      {/*Heaidng  constant regardless of route*/}
      <Header/>
     <Suspense fallback={<Loader/>}>  {/*till components loads*/}
     <Routes>



      {/*no loginn required */}
      
        <Route path="/" element={<Home/>}/>  
        <Route path="/search" element={<Search/>}/>
        <Route path="/cart" element={<Cart/>}/>
        <Route path="/product/:id" element={<Product/>}/>


        <Route element={<ProtectedRoute isAuthenticated={user?false:true} redirect="/"/>}>
        <Route path="/login" element={<Login/>}/>
        </Route>




          {/*requiree log in  routes */}

        <Route element={<ProtectedRoute isAuthenticated={user?true:false} redirect="/"/>}>
        <Route path="/shipping" element={<Shipping/>}/>
        <Route path="/pay" element={<Checkout/>}/>
        <Route path="/orders" element={<Orders/>}/>
        <Route path="/orders/:id" element={<OrderDetails/>}/>
        </Route>

       

       

 {/*admin routes */}


  <Route element={<ProtectedRoute isAuthenticated={user?true:false} redirect="/"  adminOnly={true} isAdmin={(user?.role==="admin")?true:false}/>}>
     <Route path="/admin/dashboard" element={<Dashboard />} />
     <Route path="/admin/product" element={<Products />} />
     <Route path="/admin/customer" element={<Customers />} />
     <Route path="/admin/transaction" element={<Transaction />} />
  {/* Charts */}
     <Route path="/admin/chart/bar" element={<Barcharts />} />
     <Route path="/admin/chart/pie" element={<Piecharts />} />
     <Route path="/admin/chart/line" element={<Linecharts />} />
  {/* Apps */}
     <Route path="/admin/app/coupon" element={<Coupon />} />
     <Route path="/admin/app/coupon/create" element={<COuponCreate />} />
     <Route path="/admin/app/coupon/new" element={<NewCoupon/>} />

     <Route path="/admin/app/stopwatch" element={<Stopwatch />} />
     <Route path="/admin/app/toss" element={<Toss />} />

  {/* Management */}
     <Route path="/admin/product/new" element={<NewProduct />} />
     <Route path="/admin/product/:id" element={<ProductManagement />} />
     <Route path="/admin/transaction/:id" element={<TransactionManagement />} />
  </Route>

<Route path="/404" element={<NotFound/>}/>

      </Routes>
     </Suspense>
      <Toaster position="bottom-center"/>
      </BrowserRouter>
  )
}

export default App