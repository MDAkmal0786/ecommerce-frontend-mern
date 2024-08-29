import { userBodyType } from "./api-types";

export interface userReducerInitialState {
    user:userBodyType | null ;
    loading:boolean,
    detectToken:boolean,
}

export interface  cartProdutType{
    _id:string ,
    name:string ,
    photo:string ,
    price:number ,
    stock:number,
    quantity:number
}

export type ShippingInfoType={

    adress:string,
    city:string,
    state:string,
    country:string,
    pinCode:number,

}