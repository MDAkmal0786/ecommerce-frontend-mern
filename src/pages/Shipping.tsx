
import { FormEvent, useEffect, useState } from "react"
import { BiArrowBack } from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RootState } from "../redux/store";
import { addShipping } from "../redux/reducers/cartReducer";
import axios from "axios";
import toast from "react-hot-toast";


interface adressDatatype{
  adress : string,
  city :string,
  state : string,
  country:string,
  pinCode:string,

}



const Shipping = () => {
  let navigate = useNavigate() ;
  let dispatch = useDispatch();
 let {products ,total } = useSelector((state:RootState)=>state.cartReducer) ;

  let [Address , setAdress] = useState<adressDatatype>({
     
    adress : "",
  city :"",
  state : "",
  country:"",
  pinCode:"",


  });

  useEffect(
    ()=>{
          if ( products.length<=0 )   return navigate("/cart");
    },
    [products]
  )

  function submitHandler (e:FormEvent<HTMLFormElement>){

    e.preventDefault();

    dispatch(addShipping({
      adress : Address.adress,
      city : Address.city,
      state :  Address.state,
      country:  Address.country,
      pinCode: Number(Address.pinCode),
    }));

    axios.post(`${import.meta.env.VITE_SERVER}/api/v1/payment/create`,{amount:total} ,  {headers:{"Content-Type":"application/json"}} ).then((res)=>{ //  c r e a t e   p a y m e n t   i n t e n t
     
       
      navigate("/pay" , {state:res.data.clientSecret});  // passing  state across routes  as pay depends on shipping
    }).catch((error)=>{
        toast.error(error.response.data.message);  
    })
   

     


  }
    

  return (
    <div className="shipping-box">
      <button className="shipping-back" onClick={()=>{navigate("/cart")}}><BiArrowBack/></button>
      
      <form onSubmit={submitHandler}>
      <h2>SHIPPING ADDRESS</h2>
      <input type="text" placeholder="Adress" value={Address.adress} onChange={(e)=>setAdress({...Address , adress:e.target.value})} required/>
      <input type="text" placeholder="City" value={Address.city} onChange={(e)=>setAdress({...Address , city:e.target.value})} required/>
      <input type="text" placeholder="State" value={Address.state} onChange={(e)=>setAdress({...Address , state:e.target.value})} required/>

      <select name="country" className="select-country" value={Address.country} onChange={(e)=>setAdress({...Address , country:e.target.value})} required>
        <option value=""  >Choose Country</option>
        <option value="india"  >India</option>
        <option value="usa"  >USA</option>
        <option value="uk"  >UK</option>
       
    </select>
      <input type="text" placeholder="Pin Code" value={Address.pinCode} onChange={(e)=>setAdress({...Address , pinCode:e.target.value})} required/>
    <input type="submit" value={"PAY NOW"}/>

      </form>

    </div>
  )
}

export default Shipping