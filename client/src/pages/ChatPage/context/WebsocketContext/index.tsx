import React, { useContext, useEffect } from "react";
import { useWebSocket } from "react-use-websocket/dist/lib/use-websocket";
import { accessTokenName, CHAT_WEBSOCKET_URL } from "../../../../constants";

type ContextType = ReturnType<typeof useWebSocket> | null;

const WebSocketContext = React.createContext<any>(null); // <- typeof ContextType

export const useWebSocketContext = () => useContext(WebSocketContext);

const WebSocketProvider = ({ children }: any) => {
  const { sendJsonMessage, lastJsonMessage, readyState } = useWebSocket(
    CHAT_WEBSOCKET_URL,
    {
      queryParams: {
        token:
          document.cookie.match(
            `(?<=; ${accessTokenName}=|^${accessTokenName}=)[\\w.-]+`
          )?.[0] || "none",
      },
    }
  );

  useEffect(() => {
  }, [lastJsonMessage]);

  return (
    <WebSocketContext.Provider
      value={{ sendJsonMessage, lastJsonMessage, readyState }}
    >
      {children}
    </WebSocketContext.Provider>
  );
};

export default WebSocketProvider;
