import { useNavigate } from "react-router-dom";

const HomeHero = () => {

  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center text-center">

      <h1 className="text-5xl font-bold mb-4">
        Build stunning websites <span className="text-purple-400">with AI</span>
      </h1>

      <p className="text-zinc-400 mb-8">
        Describe your idea and let AI generate a modern website.
      </p>

      <button
        className="px-6 py-3 bg-white text-black rounded-lg font-semibold hover:scale-105 transition"
        onClick={() => navigate("/home/generate")}
      >
        Generate Website
      </button>

    </div>
  );
};

export default HomeHero;