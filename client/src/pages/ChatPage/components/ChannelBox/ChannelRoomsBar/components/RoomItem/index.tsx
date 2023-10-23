import { useState, useEffect, HTMLProps, forwardRef } from "react";
import { BiHash } from "react-icons/bi";
import { HiUserAdd } from "react-icons/hi";
import { RoomType } from "../../../../../../../constants";
import {
  ContextMenuProvider,
  ContextMenuTrigger,
  ContextMenu,
} from "../../../../../../../modals/ContextMenu";
import { useChatContext } from "../../../context";
import { PopupMenuDivider } from "../PopupMenuDivider";
import PopupMenuItem from "../PopupMenuItem";
import DeleteRoomItem from "./components/DeleteRoomItem";

export const RoomItem = ({ room }: { room: RoomType }) => {
  const [isUnread, setIsUnread] = useState(false);

  useEffect(() => {
    setIsUnread(room.participant.unread_count > 0);
  }, [room.participant.unread_count]);

  return (
    <div className="flex flex-row items-center mt-1">
      <div
        className={`absolute h-2 w-1 bg-white rounded-e-lg origin-left transition
                    duration-150 ease-out ${isUnread ? "" : "scale-0"}`}
      />

      <ContextMenuProvider arrowEnabled={false}>
        <ContextMenuTrigger asChild>
          <Trigger room={room} setIsUnread={setIsUnread} />
        </ContextMenuTrigger>
        <RoomContextMenu roomId={room.id} />
      </ContextMenuProvider>
    </div>
  );
};

interface TriggerProps extends HTMLProps<HTMLDivElement> {
  room: RoomType;
  setIsUnread: React.Dispatch<React.SetStateAction<boolean>>;
}

const Trigger = forwardRef<HTMLDivElement, TriggerProps>(function Trigger(
  { room, setIsUnread, ...props },
  innerRef
) {
  const { currentRoom, setCurrentRoom } = useChatContext();

  const onRoomSelection = (event: React.MouseEvent, room: RoomType) => {
    setCurrentRoom(room);
    setIsUnread(false);
  };

  const onAddUser = (event: React.MouseEvent) => {
    event.stopPropagation();
  };

  return (
    <div
      onClick={(event) => onRoomSelection(event, room)}
      className={`flex flex-row items-center justify-evenly mx-3 py-[3px]
        rounded-[0.25rem] cursor-pointer group transition duration-100 
        ease-out hover:text-gray-400 w-full
        ${
          currentRoom === room
            ? "bg-gray-700 hover:bg-gray-600 text-gray-400"
            : "bg-transparent hover:bg-gray-700 text-gray-500 "
        }`}
      {...props}
    >
      <BiHash size="22" className="text-gray-500 mx-1" />
      <h5
        className="font-semibold font-sans tracking-wide mr-auto select-none transition
            duration-100 ease-out cursor-pointer overflow-hidden whitespace-nowrap 
            text-ellipsis"
      >
        {room.name}
      </h5>
      <HiUserAdd
        onClick={(event) => onAddUser(event)}
        size="18"
        className="mx-2 text-gray-500  opacity-0 group-hover:opacity-100
            hover:text-gray-400 transform ease-in-out duration-200"
      />
    </div>
  );
});

export const RoomContextMenu = ({ roomId }: { roomId: number }) => {
  return (
    <ContextMenu>
      <PopupMenuItem text="Mark As Read" disabled />
      <PopupMenuDivider />
      <PopupMenuItem text="Invite People" disabled />
      <PopupMenuItem text="Copy Link" disabled />
      <PopupMenuDivider />
      <PopupMenuItem text="Mute Room" disabled />
      <PopupMenuItem text="Notification Settings" disabled />
      <PopupMenuDivider />
      <PopupMenuItem text="Edit Room" disabled />
      <DeleteRoomItem label="Delete Room" roomId={roomId} />
    </ContextMenu>
  );
};
