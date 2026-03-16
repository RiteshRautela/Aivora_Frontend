import axios from "axios"
import { Base_Url } from "../utils/constant"
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
function Navbar() {

const navigate = useNavigate();


  const handleLogout  = async() =>{
      await axios.post(Base_Url + "/logout", {} ,{withCredentials:true})
      //  when user logged out redirect user to Landingpage 
      navigate("/")
  }
  return (
    <>
   <div className="navbar bg-gradient-to-b from-black/90 to-transparent text-neutral-content">

    

  <div className="flex-1">
    <a className="btn btn-ghost text-xl">Aivora</a>
  </div>
  <div className="flex gap-2">
    
    <div className="dropdown dropdown-end">
      <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
        <div className="w-10 rounded-full">
          <img
            alt="Tailwind CSS Navbar component"
            src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
        </div>
      </div>
      <ul
        tabIndex="-1"
        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
        
       
        <li>
          <Link to="dashboard">Dash</Link>
        </li>
        <li> <Link to="editor">Edit</Link></li>
         <li><a onClick={handleLogout}>Logout</a></li>

      </ul>
    </div>
  </div>
</div>
    </>    
    
  )
}

export default Navbar

