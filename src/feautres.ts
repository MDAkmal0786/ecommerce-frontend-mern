

export function pastMonths(length:number){
    let months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "June",
        "July",
        "Aug", 
        "Sept",
        "Oct",
        "Nov",
        "Dec", 
          ]

   
    let currentDate = new Date();
   let currentMonth = currentDate.getMonth();
   
   let startMonth=(currentMonth-(length-1)+12)%12
   
   let data:string[]=[];
   
   for (let i = startMonth; i!=currentMonth; i=(i+1)%12){
       data.push(months[i]);
   }
   
   data.push(months[currentMonth]);

   return data;



}