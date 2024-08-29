
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import {  useState } from "react"
import toast from "react-hot-toast";
import { auth } from "../firebase";
import { useNewUserMutation } from "../redux/api/userApi";
import { messageResponse, userBodyType } from "../types/api-types";//@ts-ignore
import { FetchBaseQueryError } from "@reduxjs/toolkit/query/react ";
import { useDispatch } from "react-redux";
import { ChangeDetectToken } from "../redux/reducers/userReducer";



const Login = ( ) => {

  let [gender , setGender] = useState<string> ("") ;
  let [date , setDate] = useState<string> ("") ;


  let dispatch = useDispatch() ;

const [newUser]=  useNewUserMutation() ;

  
  const  loginHandler =async ( ) =>{ // through firebase 
  // firebase steps --> sign in create project take its config info and paste in firebase file + return getauth(configdata) + now cretaer new provider-->> now signinwithPOPUP( pass auth+provider)
      

   try {
      const provider = new GoogleAuthProvider();
    const data=  await signInWithPopup(auth , provider); // open popup of firebase



    // MAKE A POST REQUEST FOR USER 
    const body:userBodyType={

      dob:date,
      gender:gender,
      name:data.user.displayName!,
      photo:data.user.photoURL! ,
      email:data.user.email!,
      _id:data.user.uid,
      role:"user"

    }

// new user  responses
// (messages :
// registred or
// signedin or
// (error) fill all filed )
 // HENCE MANAGE THE RESPONSES FOR  U S E R    A S   W E L L




 let res = await  newUser(body) ;   // response in form of       res  {  data : {success , message}   }   either 
 //res =  {  error(FetchBaseQueryError) :{status: , data:} }  // fetchBaseQueryError
  
  
 if ( "data" in res )  {
  toast.success(res.data!.message) ;
  
dispatch(ChangeDetectToken(true));
  
 }
 else{

  const error = res.error as FetchBaseQueryError;
  const data = error.data as messageResponse;

  toast.error(data.message);

  



 }
    
   } catch (error) {
    toast.error("Sign in Failed") ;
   }
            
  }

  return (
    <div className="login-box">
       <section>
       <h1>LOGIN</h1>
        <p>Gender</p>
       <select name="gender" value={gender} onChange={(e)=>setGender(e.target.value)}>
       <option value="">Select Gender</option>
       <option value="male">Male</option>
       <option value="female">Female</option>
       <option value="other">Other</option>
       </select>



       <p>Date of Birth</p>
       <input type="date" value={date} onChange={(e)=>setDate(e.target.value)}/>
        

        <p  id="Alredy-signin">Allready Signed in Once</p>

       <button onClick={loginHandler} >
       <div >
       <img style={{height:"50px", width:"50px"}} src="https://kgo.googleusercontent.com/profile_vrt_raw_bytes_1587515358_10512.png" alt="google"/>
       <span>Sign in With Google</span>
        </div>
       </button>


       </section>
        
    </div>
  )
}

export default Login