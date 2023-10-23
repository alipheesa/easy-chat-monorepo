import { useState } from "react";

const UnreadNotification = ({
  unreadCount,
  date,
}: {
  unreadCount: number;
  date: string;
}) => {
  const [isOpen, setIsOpen] = useState(true);

  const markAsRead = () => {
    setIsOpen(false);
  };

  return (
    <>
      {isOpen && (
        <div
          className="flex flex-row w-11/12 bg-sky-400 opacity-90 mx-4 px-2 pb-0.5
            rounded-b-xl text-gray-100 text-sm z-0 shadow-md"
        >
          <p className="mr-auto">
            {unreadCount} New Messages since {date}
          </p>
          <p className="hover:underline cursor-pointer" onClick={markAsRead}>
            Mark As Read
          </p>
        </div>
      )}
    </>
  );
};

export default UnreadNotification;
