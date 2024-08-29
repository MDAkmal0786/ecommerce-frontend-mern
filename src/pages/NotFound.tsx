import { BiSolidError } from "react-icons/bi"
import { TbError404 } from "react-icons/tb"

const NotFound = () => {
  return (
    <div className="notFound-box">
         <BiSolidError />
        <div>
        <div><TbError404 /></div> 
        <h1>NOT FOUND</h1>
        </div>
    </div>
  )
}

export default NotFound