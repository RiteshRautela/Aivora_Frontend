import { ArrowLeft, Rocket, Share2, Check } from "lucide-react";
import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

function Dashboard() {

  const navigate = useNavigate();

  const [websites, setWebsites] = useState([
    {
      _id: "1",
      title: "Fitness Landing Page",
      updatedAt: new Date(),
      deployed: false,
      deployUrl: "",
      latestCode: "<h1 style='text-align:center'>Fitness Website</h1>"
    },
    {
      _id: "2",
      title: "AI SaaS Landing",
      updatedAt: new Date(),
      deployed: false,
      deployUrl: "",
      latestCode: "<h1 style='text-align:center'>AI SaaS</h1>"
    }
  ]);

  const [copiedId, setCopiedId] = useState(null);

  // simulate deploy
  const handleDeploy = (id) => {

    const fakeUrl = `https://site-${id}.vercel.app`;

    setWebsites((prev) =>
      prev.map((w) =>
        w._id === id
          ? { ...w, deployed: true, deployUrl: fakeUrl }
          : w
      )
    );
  };

  // copy link
  const handleCopy = async (site) => {

    await navigator.clipboard.writeText(site.deployUrl);

    setCopiedId(site._id);

    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white">

      {/* Header */}
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

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-10">

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <p className="text-sm text-zinc-400 mb-1">Your Websites</p>
          <h1 className="text-3xl font-bold">Dashboard</h1>
        </motion.div>

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
                className="rounded-2xl bg-white/5 border border-white/10 overflow-hidden hover:bg-white/10 transition flex flex-col"
              >

                {/* Preview */}
                <div className="relative h-40 bg-black">

                  <iframe
                    srcDoc={w.latestCode}
                    className="absolute inset-0 w-[140%] h-[140%] scale-[0.72] origin-top-left pointer-events-none bg-white"
                  />

                  <div className="absolute inset-0 bg-black/30" />

                </div>

                {/* Content */}
                <div className="p-5 flex flex-col gap-4 flex-1">

                  <h3 className="text-base font-semibold line-clamp-2">
                    {w.title}
                  </h3>

                  <p className="text-xs text-zinc-400">
                    Last Updated {new Date(w.updatedAt).toLocaleDateString()}
                  </p>

                  {!w.deployed ? (

                    <button
                      onClick={() => handleDeploy(w._id)}
                      className="mt-auto flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-gradient-to-r from-indigo-500 to-purple-500 hover:scale-105 transition"
                    >
                      <Rocket size={18} />
                      Deploy
                    </button>

                  ) : (

                    <button
                      onClick={() => handleCopy(w)}
                      className={`mt-auto flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition
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