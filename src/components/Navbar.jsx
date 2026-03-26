import axios from "axios"
import { Base_Url } from "../utils/constant"
import { useLocation, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { Coins } from "lucide-react";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector((state) => state.user);
  const credits = user?.credits ?? 0;

  const getEditorProjectId = () => {
    const pathMatch = location.pathname.match(/\/home\/editor\/([^/]+)/);

    if (pathMatch?.[1]) {
      return pathMatch[1];
    }

    return localStorage.getItem("lastEditorProjectId");
  };

  const handleEditClick = () => {
    const projectId = getEditorProjectId();

    if (projectId) {
      navigate(`/home/editor/${projectId}`);
      return;
    }

    navigate("/home/dashboard", {
      state: {
        toast: {
          message: "Open a project from the dashboard first.",
        },
      },
    });
  };


  const handleLogout  = async() =>{
      await axios.post(Base_Url + "/logout", {} ,{withCredentials:true})
      //  when user logged out redirect user to Landingpage 
      navigate("/")
  }

  return (
    <>
      <div className="navbar relative z-[120] bg-gradient-to-b from-black/90 to-transparent text-neutral-content">

        <div className="flex-1">
          <Link to="/home" className="btn btn-ghost text-xl">
            Aivora
          </Link>
        </div>
        <div className="flex gap-2">
          <div className="mr-2 flex items-center gap-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 px-4 py-1.5 text-sm font-semibold transition hover:scale-105">
            <Coins size={16} />
            <span>{credits}</span>
          </div>

          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
              <div className="w-10 rounded-full">
                <img
                  alt="Tailwind CSS Navbar component"
                  src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                />
              </div>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content z-[130] mt-3 w-52 rounded-box bg-purple-600 p-2 shadow-xl"
            >
              <li>
                <Link to="dashboard">Dash</Link>
              </li>
              <li><button onClick={handleEditClick}>Edit</button></li>
              <li><Link to="price">Pricing</Link></li>
              <li><a onClick={handleLogout}>Logout</a></li>
            </ul>
          </div>
        </div>
      </div>
    </>    
    
  )
}

export default Navbar

