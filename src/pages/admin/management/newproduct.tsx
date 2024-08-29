import { ChangeEvent, FormEvent, useState } from "react";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import { messageResponse } from "../../../types/api-types";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { useNewProductsMutation } from "../../../redux/api/productApi";
import toast from "react-hot-toast";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { useNavigate } from "react-router-dom";

const NewProduct = () => {
   const navigate = useNavigate();
  const [newProduct] =  useNewProductsMutation();

  let user = useSelector((state:RootState)=>state.userReducer.user)

  const [name, setName] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [price, setPrice] = useState<number>(1000);
  const [stock, setStock] = useState<number>(1);
  const [photoPrev, setPhotoPrev] = useState<string>("");  // for storing file adrress to be used as   S R C   in image
  const [photo, setPhoto] = useState<File>();  // file real file state

 

  const formSubmitHandler=async(e:FormEvent<HTMLFormElement>)=>{

    e.preventDefault();

    
    const formdata = new FormData();  // make key-value pairs for form for multer to pick image
    formdata.set("name" , name);
    formdata.set("category" , category);
    formdata.set("price" , String(price));
    formdata.set("stock" , String(stock));
    formdata.set("photo" , photo!);
   
   

   const  res = await newProduct({_id:user?._id! , body:formdata});

   if ( "data" in res){
     toast.success(res.data?.message!);
     navigate("/admin/product");
   }
   else{

    let err = res.error as FetchBaseQueryError;
    const data = err.data as messageResponse;
    toast.error(data.message);

   }

   setName("");
   setPrice(1000);
   setStock(1);
   setPhoto(undefined);
   setPhotoPrev("");

  }
  const changeImageHandler = (e: ChangeEvent<HTMLInputElement>) => {

    const file: File | undefined = e.target.files?.[0];  // update photo state with the photo selected 

    const reader: FileReader = new FileReader();

    if (file) {
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          setPhotoPrev(reader.result);
          setPhoto(file);
        }
      };
    }
  };

  return (
    <div className="admin-container">
      <AdminSidebar />
      <main className="product-management">
        <article>
          <form onSubmit={formSubmitHandler}>
            <h2>New Product</h2>
            <div>
              <label>Name</label>
              <input
                type="text"
                placeholder="Name"
                required
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
                required
                placeholder="eg. laptop, camera etc"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />
            </div>

            <div>
              <label>Photo</label>
              <input required type="file"  onChange={changeImageHandler} /> 
            </div>

            {photoPrev && <img src={photoPrev} alt="New Image" />}  {/* src needed a string*/}
            
            <button type="submit">Create</button>
          </form>
        </article>
      </main>
    </div>
  );
};

export default NewProduct;
