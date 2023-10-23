import { useEffect, useRef, useState } from "react";
import { BsPlusCircleFill } from "react-icons/bs";
import { RiSendPlaneFill } from "react-icons/ri";
import { useWebSocketContext } from "../../../../../context/WebsocketContext";

const PlusIcon = () => (
  <BsPlusCircleFill
    size="24"
    className="text-gray-500 ml-2 mr-3 cursor-pointer hover:text-gray-400
        transition duration-300 ease-out"
  />
);

const PlaneIcon = (props: any) => (
  <RiSendPlaneFill
    {...props}
    size="26"
    className="text-gray-500 mx-2 cursor-pointer hover:text-gray-400
        transition duration-300 ease-out"
  />
);

const BottomBar = () => {
  const message = useRef<HTMLInputElement>(null);
  const { sendJsonMessage, lastJsonMessage } = useWebSocketContext();
  const [inputValue, setInputValue] = useState<string>("");
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const [typing, setTyping] = useState<boolean>(false);
  const typingTimeout = useRef<NodeJS.Timeout>();

  useEffect(() => {
    return () => clearTimeout(typingTimeout.current);
  });

  useEffect(() => {
    if (!lastJsonMessage) return;

    const ws_message_type = lastJsonMessage.type;

    if (ws_message_type !== "typing.status") return;

    const fullName: string = lastJsonMessage.name;
    const isTyping: boolean = lastJsonMessage.is_typing;

    if (isTyping === true) {
      if (typingUsers.includes(fullName)) return;
      setTypingUsers((users) => [fullName, ...users]);
    } else {
      if (!typingUsers.includes(fullName)) return;
      setTypingUsers((users) => [...users.filter((name) => name !== fullName)]);
    }
  }, [lastJsonMessage]);

  const handleSubmit = () => {
    if (inputValue.length === 0) return;

    clearTimeout(typingTimeout.current);
    setTyping(false);

    sendJsonMessage({
      type: "message.send",
      text: inputValue,
    });

    sendJsonMessage({
      type: "change.typing.status",
      is_typing: false,
    });

    setInputValue("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    clearTimeout(typingTimeout.current);

    if (e.code === "Enter") {
      handleSubmit();
      return;
    }

    if (e.key === "Backspace" && inputValue.length === 0) return;
    if (!isPrintableKey(e.key) && e.key !== "Backspace") return;
    if (typing) return;

    setTyping(true);
    sendJsonMessage({
      type: "change.typing.status",
      is_typing: true,
    });
  };

  const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    clearTimeout(typingTimeout.current);

    if (inputValue.length === 0) {
      if (!typing) return;
      setTyping(false);
      sendJsonMessage({
        type: "change.typing.status",
        is_typing: false,
      });
    } else {
      typingTimeout.current = setTimeout(() => {
        setTyping(false);
        sendJsonMessage({
          type: "change.typing.status",
          is_typing: false,
        });
      }, 3000);
    }
  };

  return (
    <div className="w-11/12">
      <div
        className="flex flex-row items-center justify-between relative -top-1 rounded-lg
            shadow-lg bg-gray-600 px-2 h-12 w-full shrink-0"
      >
        <PlusIcon />
        <input
          ref={message}
          value={inputValue}
          type="text"
          onKeyDown={handleKeyDown}
          onKeyUp={handleKeyUp}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Enter message..."
          className="w-full outline-none mr-auto text-gray-400
                placeholder-gray-500 bg-transparent rounded-md cursor-text"
        />
        <PlaneIcon onClick={handleSubmit} />
      </div>
      <div className="flex flex-row mb-2">
        {typingUsers.length > 0 && (
          <>
            <h1 className="text-gray-400 text-sm">
              {typingUsers.length < 5
                ? typingUsers.join(", ")
                : `${typingUsers[0]} and ${typingUsers.length - 1} others`}{" "}
              {typingUsers.length === 1 ? "is typing" : "are typing"}
            </h1>
            <div className="typing-dots-animation ml-1 mb-0.5" />
          </>
        )}
      </div>
    </div>
  );
};

const isPrintableKey = (key: string) => {
  return key.length === 1;
};

export default BottomBar;
