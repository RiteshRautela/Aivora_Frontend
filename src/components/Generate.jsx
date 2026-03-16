import axios from "axios";
import { useState } from "react";
import { Base_Url } from "../utils/constant";
function Generate() {
  const [prompt, setPrompt] = useState("");


  const handleGenerate = async() =>{
   try {
    const res =  await axios.post(Base_Url+"/generate", {prompt} ,  {withCredentials: true})
    console.log(res)
   } catch (err) {
      console.error("generate failed:", err.response?.data);
   }

  }


  const handleInput = (e) => {
    setPrompt(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = e.target.scrollHeight + "px";
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center pt-24">

      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold">
          Build Websites with  Ai Avora
        </h1>
        <p className="text-zinc-400">
          This process may take several minutes, Aviro Ai focuses on quality, not shortcuts.
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
          className="mx-[39%] mt-4 px-10 py-3 bg-white text-black rounded-2xl hover:bg-purple-700"
          onClick={ handleGenerate}
        >
          Generate
        </button>

      </div>
    </div>
  );
}

export default Generate;