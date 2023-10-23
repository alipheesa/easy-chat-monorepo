import axios from "axios";
import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import NavigationSideBar from "./components/NavigationSideBar";
import { API_URLS } from "../../constants";
import { useChatContext } from "./components/ChannelBox/context";

const ChatPageLayout = () => {
  const { setGroups } = useChatContext();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(API_URLS.api.GET_GROUP_LIST(), { withCredentials: true })
      .then((response) => {
        setGroups(response.data);
        setTimeout(() => setLoading(false), 500);
      })
      .catch(console.log);
  }, []);

  return (
    <>
      {
        <div
          className={`absolute flex flex-col w-screen h-screen bg-gray-900 items-center justify-center
                transition duration-500 z-50 ease-out ${
                  loading ? "opacity-100" : "opacity-0 pointer-events-none"
                }`}
        >
          <h1 className=" text-white text-2xl mb-4 ml-4">Loading...</h1>
          <div className="bars-loading-animation" />
        </div>
      }
      {
        <div className="flex flex-row w-screen h-screen">
          <NavigationSideBar />
          <Outlet />
        </div>
      }
    </>
  );
};

export default ChatPageLayout;
