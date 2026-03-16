import axios from "axios";
import { Base_Url } from "./constant";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { addUser } from "./userSlice";

export const useGetCurrentUser = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(
          Base_Url + "/me",
          { withCredentials: true }
        );

        dispatch(addUser(res.data)); // 🔥 store in redux
      } catch (error) {
        console.error("Fetch user failed:", error.response?.data);
      }
    };

    fetchUser();
  }, []);
};