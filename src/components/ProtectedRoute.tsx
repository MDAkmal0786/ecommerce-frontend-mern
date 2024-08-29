import { Navigate, Outlet } from "react-router-dom"

interface props{
  isAuthenticated:boolean,
  redirect:string,
  adminOnly?:boolean,
  isAdmin?:boolean,
}
const ProtectedRoute = ( { isAuthenticated , redirect  , adminOnly , isAdmin }:props) => {  // parent element for for a grp of route this will run first then child routeleemnt  -->>  by Outlet

  if ( !isAuthenticated){

    return  <Navigate to={redirect}/>  // retun to some other route

  }
  if ( adminOnly && !isAdmin ) {

    return  <Navigate to={redirect}/>  

  }
 
  return <Outlet/>    // otherwise return to the child desired elelement
  
}

export default ProtectedRoute