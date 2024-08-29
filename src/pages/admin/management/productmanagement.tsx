import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import { useDeleteProductsMutation, useGetAProductQuery, useUpdateProductsMutation } from "../../../redux/api/productApi";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { messageResponse } from "../../../types/api-types";
import { Skeleton } from "../../../components/Loader";




  

const Productmanagement = () => {
  let location= useLocation();
  let navigate = useNavigate();

  let productId = location.pathname.split('/').pop();

  const [deleteProduct] = useDeleteProductsMutation();
  const [updateProduct] = useUpdateProductsMutation();
  const user = useSelector((state:RootState)=>state.userReducer.user)

  const{data , isError , error ,isLoading} = useGetAProductQuery(productId!) ;
  if(isError){
    

    const err = error as FetchBaseQueryError;
    const data = err.data as messageResponse;
    toast.error(data.message);
     navigate("/404");

  }
  
  const product = data?.product;

  const [price, setPrice] = useState<number>(1);
  const [stock, setStock] = useState<number>(1);
  const [name, setName] = useState<string>("");
  const [photo, setPhoto] = useState<string>("");
  const [category, setCategory] = useState<string>("") ;
  const [photoFile, setPhotoFile] = useState<File>();


  useEffect(() => {
   data&&( setPrice(product?.price!),
    setStock(product?.stock!),
    setName(product?.name!),
    setPhoto(product?.photo!),
    setCategory(product?.category!))
  }, [data])
  

  

  const changeImageHandler = (e: ChangeEvent<HTMLInputElement>) => {

    const file: File | undefined = e.target.files?.[0] ;

    const reader: FileReader = new FileReader() ;  

    if (file) {
      reader.readAsDataURL(file) ;
      reader.onloadend = () => {
        if ( typeof reader.result === "string" ) {
          setPhoto(reader.result ) ;
          setPhotoFile(file) ; 
        }
      } ;
    }
  } ;
          
 async function deleteHandler(){
       
   
   const res = await deleteProduct( { userId:user?._id! , productId:productId! } ) ;

   if ( "data" in res){
    toast.success(res.data?.message!);
    navigate("/admin/product");
  }
  else {

   let err = res.error as FetchBaseQueryError;
   const data = err.data as messageResponse;
   toast.error ( data.message ) ;

  }

  }

  const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
 
     const formdata = new FormData();
     formdata.set("name" , name!);
     formdata.set("category" , category!);
     formdata.set("price" , String(price) );
     formdata.set("stock" , String(stock) );
     formdata.set("photo" , photoFile! );

     

   const res = await updateProduct({ userId:user?._id! , productId:productId! , body:formdata}) ;

   if ( "data" in res) {
    toast.success(res.data?.message!);
    navigate("/admin/product");
  }
  else {

   let err = res.error as FetchBaseQueryError;
   const data = err.data as messageResponse;
   toast.error ( data.message ) ;

  }
     

  };

  return (
    <div className="admin-container">
      <AdminSidebar />
      {isLoading ? <Skeleton/> :(   
      <main className="product-management">
        <section>
          <strong>{product?._id}</strong>
          <img src={photo} alt="Product" />
          <p>{name}</p>
          {stock&&stock > 0 ? (
            <span className="green">{stock} Available</span>
          ) : (
            <span className="red"> Not Available</span>
          )}
          <h3>₹{price}</h3>
        </section>
        <article>
          <button onClick={deleteHandler} className="product-delete-btn">
            <FaTrash />
          </button>
          <form onSubmit={submitHandler}>
            <h2>Manage</h2>
            <div>
              <label>Name</label>
              <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <label>Price</label>
              <input
                type="number"
                placeholder="Price"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
              />
            </div>
            <div>
              <label>Stock</label>
              <input
                type="number"
                placeholder="Stock"
                value={stock}
                onChange={(e) => setStock(Number(e.target.value))}
              />
            </div>

            <div>
              <label>Category</label>
              <input
                type="text"
                placeholder="eg. laptop, camera etc"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />
            </div>

            <div>
              <label>Photo</label>
              <input  type="file"  onChange={changeImageHandler} />
            </div>

            <button type="submit">Update</button> 
          </form>
        </article>
      </main>
      )}
    </div>
  );
};

export default Productmanagement;
