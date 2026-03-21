import { ArrowLeft, Rocket, Share2, Check } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useGetCurrentUser } from "../utils/UseGetCurrentUser";
import { useSelector } from "react-redux";
import axios from "axios";
import { Base_Url } from "../utils/constant";

function Dashboard() {
  useGetCurrentUser();

  const user = useSelector((state) => state.user);
  const navigate = useNavigate();

  const [websites, setWebsites] = useState([]);
  const [copiedId, setCopiedId] = useState(null);

  // 🔥 GET ALL WEBSITES
  const handleGetAllWebsite = async () => {
    try {
      const res = await axios.get(Base_Url + "/getall", {
        withCredentials: true,
      });
      setWebsites(res.data);
    } catch (error) {
      console.log("Error while getting websites", error.response?.data);
    }
  };

  useEffect(() => {
    handleGetAllWebsite();
  }, []);

  const getLiveRoute = (deployUrl) => {
    if (!deployUrl) return null;

    try {
      const url = new URL(deployUrl);
      const slug = url.pathname.split("/").filter(Boolean).pop();
      return slug ? `/live/${slug}` : null;
    } catch {
      return null;
    }
  };

  // 🔥 DEPLOY (REAL API)
  const handleDeploy = async (id) => {
    try {
      const res = await axios.get(Base_Url + "/deploy/" + id, {
        withCredentials: true,
      });

      const liveRoute = getLiveRoute(res.data.url);

      await handleGetAllWebsite();

      if (liveRoute) {
        navigate(liveRoute);
      }
    } catch (err) {
      console.log(err);
    }
  };

  // 🔥 COPY LINK
  const handleCopy = async (site) => {
    await navigator.clipboard.writeText(site.deployUrl);
    setCopiedId(site._id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white">

      {/* HEADER */}
      <div className="sticky top-0 z-40 backdrop-blur-xl bg-black/50 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              className="p-2 rounded-lg hover:bg-white/10 transition"
              onClick={() => navigate("/home")}
            >
              <ArrowLeft size={16} />
            </button>
            <h1 className="text-lg font-semibold">Dashboard</h1>
          </div>

          <button
            className="px-4 py-2 rounded-lg bg-white text-black text-sm font-semibold hover:scale-105 transition"
            onClick={() => navigate("/home/generate")}
          >
            + New Website
          </button>
        </div>
      </div>

      {/* CONTENT */}
      <div className="max-w-7xl mx-auto px-6 py-10">

        {/* 🔥 WELCOME CARD */}
        <div className="relative mb-10 p-[1px] rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
          <div className="rounded-2xl bg-black p-6">
            <p className="text-sm text-zinc-400">Welcome back</p>
            <h1 className="text-2xl font-bold mt-1">
              {user?.firstName || "User"} 
            </h1>
          </div>
        </div>

        {/* TITLE */}
        <div className="mb-6">
          <p className="text-sm text-zinc-400">Your Websites</p>
          <h2 className="text-3xl font-bold">Projects</h2>
        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">

          {websites.map((w, i) => {
            const copied = copiedId === w._id;

            return (
              <motion.div
                key={w._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ y: -6 }}
                onClick ={() => navigate("/home/editor")}
                className="rounded-2xl bg-white/5 border border-white/10 overflow-hidden hover:bg-white/10 transition flex flex-col"
              >

                {/* 🔥 PREVIEW */}
                <div className="relative h-40 bg-black">
                  <iframe
                    srcDoc={w.latexcode} // ✅ FIXED
                    className="absolute inset-0 w-[140%] h-[140%] scale-[0.72] origin-top-left pointer-events-none bg-white"
                  />
                  <div className="absolute inset-0 bg-black/30" />
                </div>

                {/* CONTENT */}
                <div className="p-5 flex flex-col gap-4 flex-1">
                  <h3 className="text-base font-semibold line-clamp-2">
                    {w.title}
                  </h3>

                  <p className="text-xs text-zinc-400">
                    Last Updated {new Date(w.updatedAt).toLocaleDateString()}
                  </p>

                  {!w.deployed ? (
                    <button
                      onClick={(event) => {
                        event.stopPropagation();
                        handleDeploy(w._id);
                      }}
                      className="mt-auto flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-gradient-to-r from-indigo-500 to-purple-500 hover:scale-105 transition"
                    >
                      <Rocket size={18} />
                      Deploy
                    </button>
                  ) : (
                    <button
                      onClick={(event) => {
                        event.stopPropagation();
                        handleCopy(w);
                      }}
                      className={`mt-auto flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-sm transition
                      ${
                        copied
                          ? "bg-emerald-500/20 text-emerald-400"
                          : "bg-white/10 hover:bg-white/20"
                      }`}
                    >
                      {copied ? (
                        <>
                          <Check size={14} />
                          Link Copied
                        </>
                      ) : (
                        <>
                          <Share2 size={14} />
                          Share Link
                        </>
                      )}
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
