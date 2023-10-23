import React, { useContext, useState } from "react";
import {
  GroupType,
  MessageType,
  ParticipantType,
  RoomType,
  TopicType,
} from "../../../../constants";

const useChat = () => {
  const [messages, setMessages] = useState<Array<MessageType> | []>([]);
  const [topics, setTopics] = useState<Array<TopicType> | []>([]);
  const [groups, setGroups] = useState<Array<GroupType> | []>([]);
  const [users, setUsers] = useState<Array<ParticipantType> | []>([]);

  const [currentGroup, setCurrentGroup] = useState<GroupType | null>(null);
  const [currentRoom, setCurrentRoom] = useState<RoomType | null>(null);

  return {
    messages,
    setMessages,
    topics,
    setTopics,
    groups,
    setGroups,
    users,
    setUsers,
    currentGroup,
    setCurrentGroup,
    currentRoom,
    setCurrentRoom,
  };
};

type ContextType = ReturnType<typeof useChat> | null;

export const ChatContext = React.createContext<ContextType>(null);

export function useChatContext() {
  const context = useContext(ChatContext);

  if (!context) {
    throw new Error(
      "Chat components must be wrappen in <ChatContextProvider />"
    );
  }

  return context;
}

export const ChatContextProvider = ({ children }: any) => {
  const data = useChat();

  return <ChatContext.Provider value={data}>{children}</ChatContext.Provider>;
};
