import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useChatContext } from "../context";
import { MessageType, API_URLS } from "../../../../../constants";
import { useWebSocketContext } from "../../../context/WebsocketContext";
import BottomBar from "./components/BottomBar";
import UserMessage from "./components/UserMessage";
import UnreadNotification from "./components/UnreadNotificationBar";
import Placeholder from "../../../../../common/components/dividers/Placeholder";
import DateDivider from "./components/DateDivider";
import {
  equalUntilDay,
  getDividerDateFormat,
  getMessageDateFormat,
  getUnreadNotificationDateFormat,
  toDateStr,
} from "../../../../../common/DateUtils";
import UnreadDivider from "./components/UnreadDivider";

const ChatBox = () => {
  const { currentRoom, messages, setMessages, setTopics } = useChatContext();
  const { sendJsonMessage } = useWebSocketContext();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [lastReadMessage, setLastReadMessage] = useState<MessageType | null>(
    null
  );

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current !== null) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }

    if (currentRoom === null) {
      setIsLoading(true);
    } else {
      axios
        .get(API_URLS.api.GET_ROOM_DATA(currentRoom.id), {
          withCredentials: true,
        })
        .then(({ data }) => {
          setMessages(data.messages);
          setUnreadCount(data.participant.unread_count);
          setLastReadMessage(data.participant.last_read_message);
          sendJsonMessage({
            type: "room.connect",
            room_id: currentRoom.id,
          });
        })
        .catch(console.log)
        .finally(() => setIsLoading(false));

      setTopics((topics) => {
        if (topics)
          for (const topic of topics)
            for (const room of topic.rooms)
              if (room.id === currentRoom.id) {
                room.participant.unread_count = 0;
                return [...topics];
              }

        return [...topics];
      });
    }
  }, [currentRoom]);

  useEffect(() => {
    if (containerRef.current !== null) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="flex flex-col relative items-center w-full">
      {lastReadMessage && unreadCount > 0 ? (
        <UnreadNotification
          unreadCount={unreadCount}
          date={toDateStr(
            lastReadMessage.date_sent,
            getUnreadNotificationDateFormat
          )}
        />
      ) : (
        ""
      )}

      <div
        ref={containerRef}
        className="h-full w-full bg-gray-700 overflow-y-auto
            p-4 custom-overflow-y-auto-scroll"
      >
        {!isLoading &&
          messages.map((message: MessageType, i) => {
            const time = toDateStr(message.date_sent, getMessageDateFormat);

            return (
              <React.Fragment key={message.id}>
                {i === 0 ||
                  (!equalUntilDay(
                    message.date_sent,
                    messages[i - 1].date_sent
                  ) && (
                    <DateDivider
                      date={toDateStr(message.date_sent, getDividerDateFormat)}
                    />
                  ))}
                {i === 0 && !lastReadMessage && <UnreadDivider />}
                <UserMessage
                  icon={message.sender.profile.icon}
                  isExtension={
                    i > 0
                      ? messages[i - 1].sender.id === message.sender.id
                        ? true
                        : false
                      : false
                  }
                  username={message.sender.profile.full_name}
                  time={time}
                  text={message.text}
                />
                {unreadCount > 0 &&
                  lastReadMessage &&
                  message.id === lastReadMessage.id && <UnreadDivider />}
              </React.Fragment>
            );
          })}
        <Placeholder className="mb-3" />
      </div>
      <BottomBar />
    </div>
  );
};

export default ChatBox;
