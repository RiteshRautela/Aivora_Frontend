import axios from "axios";
import { useEffect , useState } from "react";
import { useParams } from "react-router-dom";
import { Base_Url } from "../utils/constant";
import Spinner from "./Spinner";
import Header from "./Header"
import Chat from "./Chat"

const Editor = () => {
  // const { id } = useParams("69b6b2f172242526fb40a315");
  const id= "69b6b2f172242526fb40a315"
  const [website, setWebsite] = useState("");
  const [error, setError] = useState("");

  const handlewebsite = async () => {
    try {
      const result = await axios.get(Base_Url + "/getbyid/" + id, {
        withCredentials: true,
      });
      console.log(result);
      setWebsite(result.data);
    } catch (error) {
      console.log("error at getting website", error.response?.data);
      setError(error.res?.data);
    }
  };

  useEffect(() => {
    handlewebsite();
  }, [id]);

  if (error) {
    return (
      <div className="h-screen flex items-center justify-center bg-black text-red-600">
        {error}
      </div>
    );
  }

  if (!website) {
    return (
      <>
        <Spinner />
      </>
    );
  }

  return <div
  className="bg-black h-screen w-screen text-white overflow-hidden ">
    <aside>
      <Header website={website}/>
      <Chat/>
    </aside>
  </div>;
};

export default Editor;
