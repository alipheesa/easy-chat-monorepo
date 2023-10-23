import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ChatPageLayout from "./pages/ChatPage";
import { API_URLS } from "./constants";
import axios from "axios";
import { useEffect, useState } from "react";
import ChannelBox from "./pages/ChatPage/components/ChannelBox";
import { ChatContextProvider } from "./pages/ChatPage/components/ChannelBox/context";
import WebSocketProvider from "./pages/ChatPage/context/WebsocketContext";
import PublicGroupsBox from "./pages/ChatPage/components/PublicGroupsBox";
import { PublicGroupsContextProvider } from "./pages/ChatPage/components/PublicGroupsBox/context";

const PrivateRoute = ({
  element,
  to = API_URLS.local.HOMEPAGE(),
}: {
  element: JSX.Element;
  to?: string;
}) => {
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const contextMenuHandler = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isInputOrChild = target.tagName === "INPUT";

      if (!isInputOrChild) {
        e.preventDefault();
      }
    };

    axios
      .get(API_URLS.api.TOKEN_VERIFY(), { withCredentials: true })
      .then((response) => setAuthenticated(response.status === 200))
      .catch((error) => {
        console.error(error);
        setAuthenticated(false);
      })
      .finally(() => setLoading(false));

    document.addEventListener("contextmenu", contextMenuHandler);

    return () => {
      document.removeEventListener("contextmenu", contextMenuHandler);
    };
  }, []);

  if (loading) {
    return <div className="w-screen h-screen bg-gray-900" />;
  }

  return authenticated ? element : <Navigate to={to} />;
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage title="Simple Chat" />,
  },
  {
    path: API_URLS.local.LOGIN(),
    element: <LoginPage title="Log In" />,
  },
  {
    path: API_URLS.local.SIGNUP(),
    element: <SignupPage title="Sign Up" />,
  },
  {
    path: API_URLS.local.CHAT_DASHBOARD(),
    element: (
      <PrivateRoute
        element={
          <ChatContextProvider>
            <WebSocketProvider>
              <ChatPageLayout />
            </WebSocketProvider>
          </ChatContextProvider>
        }
      />
    ),
    children: [
      {
        path: "",
        element: <Navigate to={"groups"} />,
      },
      {
        path: "mail",
        element: (
          <h1 className="h-full w-full bg-gray-800 flex justify-center items-center text-4xl text-white">
            Mail
          </h1>
        ),
      },
      {
        path: "groups",
        element: (
          <PublicGroupsContextProvider>
            <PublicGroupsBox />
          </PublicGroupsContextProvider>
        ),
      },
      {
        path: ":group_id",
        element: <ChannelBox />,
      },
    ],
  },
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
