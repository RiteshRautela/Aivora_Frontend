import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { Base_Url } from "../utils/constant";
import Header from "./Header";
import Chat from "./Chat";
import Spinner from "./Spinner";
import { useNavigate, useParams } from "react-router-dom";

// 🔥 Monaco Editor
import EditorMonaco from "@monaco-editor/react";

import { ArrowLeft, Rocket, MessageSquare, Code2, Monitor } from "lucide-react";

const Editor = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [website, setWebsite] = useState(null);
  const [messages, setMessages] = useState([]);
  const [prompt, setPrompt] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  const [updateLoading, setUpdateLoading] = useState(false);
  const [thinkingIndex, setThinkingIndex] = useState(0);

  // 🔥 toggle preview / code
  const [showCode, setShowCode] = useState(false);
  const [showFullPreview, setShowFullPreview] = useState(false);
  const editorRef = useRef(null);
  const activeWebsiteIdRef = useRef(null);

  const thinkingSteps = [
    "Understanding your request…",
    "Planning layout changes…",
    "Improving responsiveness…",
    "Applying animations…",
    "Finalizing update…",
  ];

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

  const formatEditorCode = async () => {
    const editor = editorRef.current;
    if (!editor) return;

    const action = editor.getAction("editor.action.formatDocument");
    if (!action) return;

    try {
      await action.run();
    } catch (err) {
      console.log("Error while formatting code", err);
    }
  };

  // 🔥 FETCH WEBSITE
  useEffect(() => {
    if (!id) {
      setError("Project not found.");
      return;
    }

    localStorage.setItem("lastEditorProjectId", id);
    activeWebsiteIdRef.current = id;
    setWebsite(null);
    setMessages([]);
    setCode("");
    setError("");

    const getWebsite = async () => {
      try {
        const res = await axios.get(Base_Url + "/getbyid/" + id, {
          withCredentials: true,
        });

        if (activeWebsiteIdRef.current !== id) {
          return;
        }

        setWebsite(res.data);
        setMessages(res.data.conversations || []);
        setCode(res.data.latexcode);
      } catch (err) {
        if (activeWebsiteIdRef.current !== id) {
          return;
        }

        setError(err.response?.data);
      }
    };

    getWebsite();

    return () => {
      if (activeWebsiteIdRef.current === id) {
        activeWebsiteIdRef.current = null;
      }
    };
  }, [id]);

  // 🔥 THINKING LOOP
  useEffect(() => {
    if (!updateLoading) return;

    const i = setInterval(() => {
      setThinkingIndex((p) => (p + 1) % thinkingSteps.length);
    }, 1200);

    return () => clearInterval(i);
  }, [updateLoading]);

  useEffect(() => {
    if (!showCode || !code) return;

    const timeoutId = setTimeout(() => {
      formatEditorCode();
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [showCode, code]);

  // 🔥 UPDATE WEBSITE
  const handleUpdate = async () => {
    if (!prompt) return;

    const text = prompt;
    setPrompt("");
    setUpdateLoading(true);

    setMessages((m) => [...m, { role: "user", content: text }]);

    try {
      const res = await axios.post(
        Base_Url + "/update/" + id,
        { prompt: text },
        { withCredentials: true }
      );

      setMessages((m) => [
        ...m,
        { role: "ai", content: res.data.message },
      ]);

      setCode(res.data.code);
    } catch (err) {
      console.log(err);
    } finally {
      setUpdateLoading(false);
    }
  };

    // 🔥 DEPLOY (REAL API)
    const handleDeploy = async () => {
      try {
        const res = await axios.get(Base_Url + "/deploy/" + id, {
          withCredentials: true,
        });
  
        const liveRoute = getLiveRoute(res.data.url);

        if (liveRoute) {
          navigate(liveRoute);
        }
      } catch (err) {
        console.log(err);
      }
    };

 

  if (error) {
    return (
      <div className="h-screen flex items-center justify-center bg-black text-red-400">
        {error}
      </div>
    );
  }

  if (!website) return <Spinner />;

  if (showFullPreview) {
    return (
      <div className="h-screen w-screen bg-black">
        <div className="h-14 px-4 flex justify-between items-center border-b border-white/10 bg-black text-white">
          <div className="flex items-center gap-3">
            <button
              className="p-2 rounded-lg hover:bg-white/10 transition"
              onClick={() => setShowFullPreview(false)}
            >
              <ArrowLeft size={18} />
            </button>
            <span className="text-sm text-zinc-300">Preview Mode</span>
          </div>

          <button
            className="p-2 rounded-lg hover:bg-white/10 transition"
            onClick={() => setShowFullPreview(false)}
          >
            <Code2 size={18} />
          </button>
        </div>

        <iframe
          title="Full Preview"
          srcDoc={code || ""}
          sandbox="allow-scripts allow-same-origin allow-forms"
          className="w-full h-[calc(100vh-56px)] bg-white border-none"
        />
      </div>
    );
  }

  return (
    <div className="h-screen w-screen flex bg-black text-white overflow-hidden">

      {/* LEFT CHAT PANEL */}
      <aside className="hidden lg:flex w-[480px] flex-col border-r border-white/10 bg-black/80">
        <Header title={website.title} />

        <Chat
          messages={messages}
          prompt={prompt}
          setPrompt={setPrompt}
          handleUpdate={handleUpdate}
          updateLoading={updateLoading}
          thinkingSteps={thinkingSteps}
          thinkingIndex={thinkingIndex}
        />
      </aside>

      {/* RIGHT SIDE */}
      <div className="flex-1 flex flex-col">

        {/* TOP BAR */}
        <div className="h-14 px-4 flex justify-between items-center border-b border-white/10 bg-black/80">
          <span className="text-xs text-zinc-400">Live Preview</span>

          <div className="flex items-center gap-3">
            {!website.deployed && (
              <button
                className="flex items-center gap-2 px-4 py-1.5 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-sm font-semibold hover:scale-105 transition"
                onClick={handleDeploy}
              >
                <Rocket size={14} /> Deploy
              </button>
            )}

            <button className="p-2 lg:hidden">
              <MessageSquare size={18} />
            </button>

            {/* 🔥 TOGGLE CODE VIEW */}
            <button
              className="p-2"
              onClick={() => setShowCode((prev) => !prev)}
            >
              <Code2 size={18} />
            </button>

            <button
              className="p-2"
              onClick={() => setShowFullPreview(true)}
            >
              <Monitor size={18} />
            </button>
          </div>
        </div>

        {/* 🔥 PREVIEW / CODE */}
        <div className="flex-1 bg-black">

          {showCode ? (
            // 🔥 CODE VIEW (MONACO)
            <EditorMonaco
              height="100%"
              defaultLanguage="html"
              value={code}
              theme="vs-dark"
              onMount={(editor, monaco) => {
                editorRef.current = editor;
                formatEditorCode();
              }}
              onChange={(value) => setCode(value)} // 🔥 live edit
              options={{
                fontSize: 14,
                minimap: { enabled: false },
                formatOnPaste: true,
                formatOnType: true,
                wordWrap: "on",
              }}
            />
          ) : (
            // 🔥 LIVE PREVIEW
            <iframe
              title="Editor Preview"
              srcDoc={code || ""}
              sandbox="allow-scripts allow-same-origin allow-forms"
              className="w-full h-full bg-white border-none"
            />
          )}

        </div>
      </div>
    </div>
  );
};

export default Editor;
