import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import axios from "axios";
import { Base_Url } from "../utils/constant";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";

function Home() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const hideNavbar = location.pathname === "/home/dashboard";

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(Base_Url + "/me", {
          withCredentials: true,
        });

        dispatch(addUser(res.data));
      } catch (err) {
        navigate("/"); 
      }
    };

    fetchUser();
  }, []);

  return (
    <div>
      {!hideNavbar && <Navbar />}
      <Outlet />
    </div>
  );
}

export default Home;