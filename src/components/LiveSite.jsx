import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Base_Url } from "../utils/constant";

function LiveSite() {
  // 🔥 get slug from URL
  const { slug } = useParams();

  const [html, setHtml] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const handleGetWebsite = async () => {
      try {
        const res = await axios.get(
          Base_Url + "/getbyslug/" + slug
        );

        // 🔥 YOUR FIELD NAME
        setHtml(res.data.latexcode);

      } catch (err) {
        console.log(err);
        setError("Site not found");
      }
    };

    handleGetWebsite();
  }, [slug]);

  // 🔥 ERROR UI
  if (error) {
    return (
      <div className="h-screen flex items-center justify-center bg-black text-white">
        {error}
      </div>
    );
  }

  // 🔥 RENDER SITE
  return (
    <iframe
      title="Live Site"
      srcDoc={html}
      className="w-screen h-screen border-none"
      sandbox="allow-scripts allow-same-origin allow-forms"
    />
  );
}

export default LiveSite;