import { useState } from "react"
import { FaSearch, FaShoppingBag, FaSignInAlt, FaSignOutAlt } from "react-icons/fa"
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom"
import {RootState} from "../redux/store"
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import toast from "react-hot-toast";
import { ChangeDetectToken } from "../redux/reducers/userReducer";


const Header = () => {

  let [isUserButton , setIsUserButton] = useState<boolean> (false);
  let dispatch = useDispatch();

  let user = useSelector( (state:RootState)=>state.userReducer.user) // is user null then login  other wise logged in functiilatity

async function  logoutHandler()
{  
  try {

    await signOut(auth) ;  
    dispatch(ChangeDetectToken(true));  // remove token  refresh as well for onAuthChanged
    toast.success("Signed Out") ;

    setIsUserButton(false) ;

  }
  catch(error) {
    toast.error("Signed Out Failed");
  }
}


  return (
    <nav className="header">
      <Link to={"/"}  onClick={()=>setIsUserButton(false) }><div>HOME</div></Link>
      <Link to={"/search"}  onClick={()=>setIsUserButton(false) }><FaSearch /></Link>
      <Link to={"/cart"} onClick={()=>setIsUserButton(false) }><FaShoppingBag/></Link>
      {
         user?(
          <>
          <button onClick={()=>setIsUserButton((prev)=>!prev) }><img
          style={{
            height:"40px",
            width:"40px",
            borderRadius: "50%",

          }}
          src={user.photo}
          alt="user"
        /></button>          
          <dialog open={isUserButton} >  {/* the dialog box should get toggled by open atribute =>  true / false */}
           <div>
            {
              user.role==="admin" && <div> <Link to={"/admin/dashboard"}  onClick={()=>setIsUserButton(false) }><div>Admin</div></Link></div>
            }
           <div> <Link to={"/orders"}  onClick={()=>setIsUserButton(false) }><div>Orders</div></Link></div>
           <button onClick={logoutHandler}><FaSignOutAlt /></button>
           </div>
          </dialog>
          </>
         ):(
          <Link to={"/login"}> <FaSignInAlt /> </Link>
         )

    
         
      }


    </nav>
  )
}

export default Header