import axios from "axios";
import { useEffect, useState } from "react";
import { Base_Url } from "../utils/constant";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addUser } from "../utils/userSlice";
import { AnimatePresence, motion } from "framer-motion";
import { CircleAlert } from "lucide-react";

function Generate() {
  const [prompt, setPrompt] = useState("Generate a calculator");
  const [alert, setAlert] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const credits = Number(user?.credits ?? 0);
  const hasNoCredits = credits <= 0;

  useEffect(() => {
    if (!alert) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setAlert(null);
    }, 2200);

    return () => window.clearTimeout(timeoutId);
  }, [alert]);

  const getCreatedWebsiteId = (payload) =>
    payload?._id ??
    payload?.id ??
    payload?.website?._id ??
    payload?.website?.id ??
    payload?.project?._id ??
    payload?.project?.id ??
    payload?.data?._id ??
    payload?.data?.id ??
    null;

  const handleGenerate = async() =>{
   if (hasNoCredits || isGenerating) {
    return;
   }

   setIsGenerating(true);

   try {
    const res =  await axios.post(Base_Url+"/generate", {prompt} ,  {withCredentials: true})
    const createdWebsiteId = getCreatedWebsiteId(res.data);

    try {
      const userResponse = await axios.get(Base_Url + "/me", {
        withCredentials: true,
      });

      dispatch(addUser(userResponse.data));
    } catch (userError) {
      console.error(
        "Unable to refresh user after generate:",
        userError.response?.data || userError.message,
      );
    }

    if (createdWebsiteId) {
      localStorage.setItem("lastEditorProjectId", createdWebsiteId);
      navigate(`/home/editor/${createdWebsiteId}`);
      return;
    }

    navigate("/home/dashboard");
   } catch (err) {
      console.error("generate failed:", err.response?.data);
      if (err.response?.status === 403) {
        setAlert({
          type: "error",
          message: "Not enough credits to generate a website.",
        });

        window.setTimeout(() => {
          navigate("/home/price");
        }, 900);
      }
   } finally {
      setIsGenerating(false);
   }
  }


  const handleInput = (e) => {
    setPrompt(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = e.target.scrollHeight + "px";
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center pt-24">
      <AnimatePresence>
        {alert && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.98 }}
            transition={{ duration: 0.28, ease: "easeOut" }}
            className="pointer-events-none fixed inset-x-0 top-24 z-[100] flex justify-center px-4"
          >
            <div
              role="alert"
              className="pointer-events-auto flex w-full max-w-md items-start gap-3 rounded-2xl border border-amber-400/30 bg-amber-500/15 px-4 py-3 text-amber-50 shadow-[0_20px_60px_rgba(245,158,11,0.22)] backdrop-blur-xl"
            >
              <CircleAlert className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" />
              <span className="text-sm font-medium leading-6">
                {alert.message}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold">
          Build Websites with  Ai Avora
        </h1>
        <p className="text-zinc-400">
          This process may take several minutes, Aviro Ai focuses on quality, not shortcuts.
        </p>
        <p className="mt-3 text-sm text-zinc-300">
          Available credits: <span className="font-semibold text-white">{credits}</span>
        </p>
      </div>

      <div className="w-full max-w-4xl">

        <h1 className="text-3xl font-bold mb-6">
          Generate Website
        </h1>

        <textarea
          className="w-full p-4 bg-zinc-900 rounded-2xl border border-zinc-700 resize-none overflow-hidden"
          placeholder="Describe the website you want..."
          value={prompt}
          rows={1}
          onChange={handleInput}
        />

        <button
          className="mx-[39%] mt-4 px-10 py-3 rounded-2xl bg-white text-black transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:bg-zinc-700 disabled:text-zinc-300 disabled:hover:bg-zinc-700"
          onClick={ handleGenerate}
          disabled={hasNoCredits || isGenerating}
        >
          {isGenerating ? "Generating..." : "Generate"}
        </button>
        {isGenerating && (
          <div className="mt-4 flex items-center justify-center gap-3 text-sm text-zinc-300">
            <span className="loading loading-dots loading-xs"></span>
            <span>Generating your website...</span>
          </div>
        )}
        {hasNoCredits && (
          <p className="mt-3 text-center text-sm text-amber-300">
            You need more credits before generating another website.
          </p>
        )}

      </div>
    </div>
  );
}

export default Generate;
