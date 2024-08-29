import { cartProdutType, ShippingInfoType } from "./reducer-types";

export interface userBodyType{
    name:string;
    email:string;
    photo:string;
    dob:string;
    gender:string;
    _id :string;
    role:string;
}
export interface messageResponse{
    success:boolean,
    message:string

}
export interface userResponse{
    success:boolean,
    user:userBodyType

}
export interface productType{
    _id:string,
     name:string,
     photo:string,
     category:string,
     price:number,
     stock:number
}

export  type latestResponse={
      sucess:boolean,
      products:productType[]
}
export interface searchType{
       success:boolean,
       pagedproducts:productType[],
       totalPages:number
}
export interface filterType{
    name : string ,
    category : string ,
    maxPrice : number ,
    sort : string |undefined,
    page : number ,
}
export interface categoryType{
    success:boolean,
    categories:string[]
}

export interface newArgsType{
    body:FormData,
    _id:string
}
export interface deleteType{
    userId:string,
    productId:string,
}
export interface getAProductResponse{
    success:true,
    product:productType
}
export interface updateType{
    userId:string,
    productId:string,
    body:FormData
}

export interface newOrderBody{
       user:string,
       
       orderItems:cartProdutType[],

      subTotal:number,
      tax:number,
      shippingCharges:number,
      discount:number,
      total:number,

      shippingInfo:ShippingInfoType
}
export interface OrderType{

    _id:string,
    user:string,
    
    orderItems:cartProdutType[],

   subTotal:number,
   tax:number,
   shippingCharges:number,
   discount:number,
   total:number,
   status:string,

   shippingInfo:ShippingInfoType
}

export interface allOrdersResponse{
    success:boolean,
    orders:OrderType[]
}

export interface populatedOrder{
    _id:string,
    user:{
        _id:string,
        name:string,
    },
    
    orderItems:cartProdutType[],

   subTotal:number,
   tax:number,
   shippingCharges:number,
   discount:number,
   total:number,
   status:string,

   shippingInfo:ShippingInfoType

}
export interface populatedOrderResponse{
    success : boolean ,
    orders : populatedOrder[]
}
export interface getAorderResponse{
    success:boolean ,
    order:populatedOrder
}

export interface alluserType{
    success:boolean,
    users:userBodyType[]
}
export interface CouponResponse{
    
    success :boolean,
    coupons:[{ _id:string , code:string , amount:number}]

}

// dahsboard

export interface  countType{
    revenue:number,
    product:number,
    transaction:number,
    user:number,
  }



export interface stats{

    count:countType,
    percentChange:countType,
    chart:{
        order:[],
        revenue:[],
    },
    categoryCount:Record<string , number>[],
    userRatio:{
        male: number,
        female: number
    },
    topFourOrders:[{
        _id:string ,
        discount:number ,
        amount:number ,
        quantity:number,
        status:string,
      }]

}
export interface statsType {
    success:boolean,
    stats:stats,
}

export interface pie{
    orderfullfillmentRatio:{
        processing : number,
        shipped : number,
        delivered :number ,
    }
    categoryObj:{
            category : string[] ,
              count  : number[]
    } // key value pair ( category : count )    
    stockRatio:{
        inStock:number,
        outOfStock:number,
      }
    revenueDistribution: {
        netMargin: number;
        discount: number;
        productionCost: number;
        burnt: number;
        marketingCost: number;
    },
    userAgeGroup:{
        teenager: number;
        adult: number;
        older: number;
    },
    adminCustomer:{
        admin: number;
        user: number;
    }
}


export interface pieType {
    success:boolean,
    pie:pie,
}


export interface bar{
          orderThorughoutYear:number[],
          SixMonthsProductAndUsers:{
            Products:number[],
            users:number[]
          }
}
export interface barType {
    success:boolean,
    bar:bar,
}

export interface line{

          OneYearAcitveUsers:number[],
          OneYearProducts :number[],
          OneYearRevenue:number[],
          OneYearDiscount:number[],
}
export interface lineType {
success:boolean,
line:line,
}