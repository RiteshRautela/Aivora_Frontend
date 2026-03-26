import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import axios from "axios";
import { Base_Url } from "../utils/constant";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { CheckCircle2 } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

function Home() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [toast, setToast] = useState(location.state?.toast ?? null);

  const hideNavbar = location.pathname === "/home/dashboard";

  useEffect(() => {
    if (!location.state?.toast) {
      return;
    }

    setToast(location.state.toast);
    navigate(location.pathname, { replace: true, state: {} });
  }, [location.pathname, location.state, navigate]);

  useEffect(() => {
    if (!toast) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setToast(null);
    }, 3500);

    return () => window.clearTimeout(timeoutId);
  }, [toast]);

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
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.98 }}
            transition={{ duration: 0.28, ease: "easeOut" }}
            className="pointer-events-none fixed inset-x-0 top-6 z-[100] flex justify-center px-4"
          >
            <div
              role="alert"
              className="pointer-events-auto flex w-full max-w-md items-start gap-3 rounded-2xl border border-emerald-400/30 bg-emerald-500/15 px-4 py-3 text-emerald-50 shadow-[0_20px_60px_rgba(16,185,129,0.22)] backdrop-blur-xl"
            >
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-300" />
              <span className="text-sm font-medium leading-6">
                {toast.message}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {!hideNavbar && <Navbar />}
      <Outlet />
    </div>
  );
}

export default Home;
