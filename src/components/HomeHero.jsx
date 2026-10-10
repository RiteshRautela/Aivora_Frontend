import { useNavigate } from "react-router-dom";

const HomeHero = () => {

  const navigate = useNavigate();

  return (
    <div className="flex min-h-[calc(100dvh-4rem)] flex-col items-center justify-center bg-black px-5 py-12 text-center text-white">

      <h1 className="mb-4 text-4xl font-bold leading-tight sm:text-5xl md:text-6xl">
        Build stunning websites <span className="text-purple-400">with AI</span>
      </h1>

      <p className="mb-8 max-w-xl text-sm text-zinc-400 sm:text-base">
        Describe your idea and let AI generate a modern website.
      </p>

      <button
        className="rounded-lg bg-white px-6 py-3 font-semibold text-black transition hover:scale-105"
        onClick={() => navigate("/home/generate")}
      >
        Generate Website
      </button>

    </div>
  );
};

export default HomeHero;
