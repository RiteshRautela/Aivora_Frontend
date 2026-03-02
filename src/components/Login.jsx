import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { Base_Url } from "../utils/constant";

function Login({ onSuccess }) {
  const [emailId, setEmailId] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLogInForm, setIsLogInForm] = useState(true);

  const handleLogin = async () => {
    try {
      setError("");
      const res = await axios.post(
        Base_Url + "/login",
        {
          emailId: emailId,
          password: password,
        },
        {
          withCredentials: true,
        },
      );
      dispatch(addUser(res.data));
      if (onSuccess) {
        onSuccess(res.data);
      } else {
        navigate("/home");
      }
    } catch (err) {
      setError(err.response?.data?.error || "something went wrong");
      console.error("Login failed:", err.response?.data);
    }
  };

  const handleSignUp = async () => {
    try {
      setError("");
      const res = await axios.post(
        Base_Url + "/signup",
        {
          firstName: firstName,
          lastName: lastName,
          emailId: emailId,
          password: password,
        },
        {
          withCredentials: true,
        },
      );
      dispatch(addUser(res.data));
      if (onSuccess) {
        onSuccess(res.data);
      } else {
        navigate("/home");
      }
    } catch (err) {
     setError(err.response?.data?.error || "something went wrong");
      console.error("Login failed:", err.response?.data);
    }
  };

  return (
    <div className="flex justify-center">
      <div className="card w-96 rounded-2xl border border-cyan-500/30 bg-slate-950/95 text-slate-100 shadow-[0_12px_50px_rgba(6,182,212,0.2)]">
        <div className="card-body">
          <h2 className="card-title justify-center text-cyan-300"> 
            {isLogInForm ? "Login" : "SignUp"}
          </h2>
          <div className="space-y-4 mt-4">
            {!isLogInForm && (
              <>
                {" "}
                <label className="input input-bordered flex items-center gap-2 border-cyan-500/30 bg-slate-900/90 text-slate-100">
                  <input
                    type="text"
                    className="grow bg-transparent text-slate-100 placeholder:text-slate-400"
                    placeholder="Enter First Name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                  />
                </label>
                <label className="input input-bordered flex items-center gap-2 border-cyan-500/30 bg-slate-900/90 text-slate-100">
                  <input
                    type="text"
                    className="grow bg-transparent text-slate-100 placeholder:text-slate-400"
                    placeholder="Enter Last Name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                  />
                </label>
              </>
            )}

           
            <label className="input input-bordered flex items-center gap-2 border-cyan-500/30 bg-slate-900/90 text-slate-100">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                fill="currentColor"
                className="h-4 w-4 text-slate-400"
              >
                <path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" />
                <path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" />
              </svg>
              <input
                type="email"
                className="grow bg-transparent text-slate-100 placeholder:text-slate-400"
                placeholder="Email"
                value={emailId}
                onChange={(e) => setEmailId(e.target.value)}
                required
              />
            </label>

           
            <label className="input input-bordered flex items-center gap-2 border-cyan-500/30 bg-slate-900/90 text-slate-100">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                fill="currentColor"
                className="h-4 w-4 text-slate-400"
              >
                <path
                  fillRule="evenodd"
                  d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
                  clipRule="evenodd"
                />
              </svg>
              <input
                type="password"
                className="grow bg-transparent text-slate-100 placeholder:text-slate-400"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </label>
          </div>

          <p className="h-4 text-sm text-red-400">{error}</p>

          <div className="card-actions justify-center required my-5">
            <button
              className="btn w-full border-cyan-400/50 bg-cyan-500 text-slate-950 hover:bg-cyan-400"
              onClick={isLogInForm ? handleLogin : handleSignUp}
            >
              {isLogInForm ? "Login" : "SignUp"}
            </button>
          </div>
          <p
            className="m-auto cursor-pointer py-2 text-sm text-slate-300 hover:text-cyan-300"
            onClick={() => setIsLogInForm((value) => !value)}
          >
            {isLogInForm
              ? "New User ? SignUp Here"
              : "Existing User ? Login Here"}
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
