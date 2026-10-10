import axios from "axios";
import { useEffect, useState } from "react";
import { Base_Url } from "../utils/constant";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addUser } from "../utils/userSlice";
import { AnimatePresence, motion } from "framer-motion";
import { CircleAlert } from "lucide-react";

function Generate() {
  const [prompt, setPrompt] = useState("");
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
    (typeof payload?.website === "string" ? payload.website : null) ??
    payload?.project?._id ??
    payload?.project?.id ??
    payload?.data?._id ??
    payload?.data?.id ??
    null;

  const handleGenerate = async () => {
    const normalizedPrompt = prompt.trim();
    if (hasNoCredits || isGenerating) {
      return;
    }
    if (!normalizedPrompt) {
      setAlert({
        type: "error",
        message: "Describe what you want to create first.",
      });
      return;
    }

    setIsGenerating(true);

   try {
    const res =  await axios.post(Base_Url+"/generate", { prompt: normalizedPrompt } ,  {withCredentials: true})
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
      console.error("Generate request failed:", err.response?.data || err.message);
      if (err.response?.status === 403) {
        setAlert({
          type: "error",
          message: "Not enough credits to create another project.",
        });

        window.setTimeout(() => {
          navigate("/home/price");
        }, 900);
      } else if ([429, 503].includes(err.response?.status)) {
        setAlert({
          type: "error",
          message: "The AI service is busy right now. Please try again shortly.",
        });
      } else {
        setAlert({
          type: "error",
          message: "We couldn't create that yet. Please try again.",
        });
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
    <div className="flex min-h-screen flex-col items-center bg-black px-4 pb-12 pt-16 text-white sm:px-6 sm:pt-24">
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

      <div className="mb-8 w-full max-w-4xl text-center sm:mb-10">
        <h1 className="text-2xl font-bold sm:text-3xl">
          Build with AiVora
        </h1>
        <p className="mx-auto mt-2 max-w-2xl text-sm text-zinc-400 sm:text-base">
          Describe a website, app, calculator, or tool and let AI build it for you.
        </p>
        <p className="mt-3 text-sm text-zinc-300">
          Available credits: <span className="font-semibold text-white">{credits}</span>
        </p>
      </div>

      <div className="w-full max-w-4xl">

        <h1 className="mb-5 text-2xl font-bold sm:mb-6 sm:text-3xl">
          What would you like to build?
        </h1>

        <textarea
          className="w-full rounded-2xl border border-zinc-700 bg-zinc-900 p-4 text-base resize-none overflow-hidden"
          placeholder="Describe the website, app, calculator, or tool you want..."
          value={prompt}
          rows={1}
          onChange={handleInput}
        />

        <button
          className="mt-4 w-full rounded-2xl bg-white px-8 py-3 text-black transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:bg-zinc-700 disabled:text-zinc-300 disabled:hover:bg-zinc-700 sm:w-auto"
          onClick={ handleGenerate}
          disabled={hasNoCredits || isGenerating}
        >
          {isGenerating ? "Creating..." : "Create project"}
        </button>
        {isGenerating && (
          <div className="mt-4 flex items-center justify-center gap-3 text-sm text-zinc-300">
            <span className="loading loading-dots loading-xs"></span>
            <span>Building your project...</span>
          </div>
        )}
        {hasNoCredits && (
          <p className="mt-3 text-center text-sm text-amber-300">
            You need more credits before creating another project.
          </p>
        )}

      </div>
    </div>
  );
}

export default Generate;
