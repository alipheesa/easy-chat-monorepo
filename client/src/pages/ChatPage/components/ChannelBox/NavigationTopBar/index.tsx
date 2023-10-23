import {
  FaSearch,
  FaHashtag,
  FaRegBell,
  FaUserCircle,
  FaSun,
} from "react-icons/fa";
import {
  ContextMenuProvider,
  ContextMenuTrigger,
} from "../../../../../modals/ContextMenu";
import {
  PopupMenuProvider,
  PopupMenuTrigger,
  PopupMenu,
} from "../../../../../modals/DefaultPopupMenu";
import { Tooltip, TooltipTrigger } from "../../../../../modals/Tooltip";
import { TooltipPopup } from "../../NavigationSideBar/components/TooltipPopup";
import { RoomContextMenu } from "../ChannelRoomsBar/components/RoomItem";
import { useChatContext } from "../context";

const NavigationTopBar = () => {
  const { currentRoom } = useChatContext();

  return (
    <div
      className="flex flex-row h-16 w-full items-center px-3
        bg-gray-700 shadow-lg z-10"
    >
      <HashtagIcon />
      {currentRoom && (
        <Title roomname={currentRoom.name} roomId={currentRoom.id} />
      )}
      <Divider />
      <Description description={currentRoom?.description ?? ""} />
      <ThemeIcon />
      <Search />
      <BellIcon />
      <UserCircle />
    </div>
  );
};

const HashtagIcon = () => (
  <FaHashtag size="20" className="text-gray-500 mx-1.5" />
);

const Title = ({ roomname, roomId }: { roomname: string; roomId: number }) => {
  return (
    <ContextMenuProvider arrowEnabled={false}>
      <ContextMenuTrigger asChild>
        <h5
          className="text-gray-400 text-xl font-semibold font-sans tracking-wider opacity-90 
          select-none whitespace-nowrap"
        >
          {roomname}
        </h5>
      </ContextMenuTrigger>
      <RoomContextMenu roomId={roomId} />
    </ContextMenuProvider>
  );
};

const Divider = () => (
  <div className="border-gray-600 rounded-full h-[45%] border mx-4" />
);

const Description = ({ description }: { description: string }) => {
  return (
    <Tooltip placement="bottom" mainAxis={16}>
      <TooltipTrigger asChild={true}>
        <h5
          className="text-gray-500 font-medium text-sm tracking-tight mr-auto
          overflow-hidden whitespace-nowrap text-ellipsis"
        >
          {description}
        </h5>
      </TooltipTrigger>
      <TooltipPopup text={description} />
    </Tooltip>
  );
};

const ThemeIcon = () => (
  <FaSun
    size="24"
    className="text-gray-500 mx-4 hover:text-pink-500
    transition duration-300 ease-in-out cursor-pointer"
  />
);

const Search = () => (
  <div
    className="w-1/5 flex items-center justify-start bg-gray-600 
    text-gray-500 px-2 h-9 rounded-md shadow-md"
  >
    <input
      className="w-full bg-transparent outline-none 
      text-gray-400 placeholder-gray-500 pl-1 rounded"
      type="text"
      placeholder="Search..."
    />
    <FaSearch size="18" className="my-auto" />
  </div>
);

const BellIcon = () => (
  <PopupMenuProvider alignmentAxis={51} mainAxis={-29}>
    <PopupMenuTrigger className="mx-4" fixed>
      <FaRegBell
        size="24"
        className="text-gray-500 hover:text-pink-500
      transition duration-300 ease-in-out cursor-pointer"
      />
    </PopupMenuTrigger>
    <PopupMenu>
      <div className="flex flex-col w-[22vw] h-[65vh] bg-gray-950 rounded-[4px]"></div>
    </PopupMenu>
  </PopupMenuProvider>
);

const UserCircle = () => (
  <PopupMenuProvider alignmentAxis={51} mainAxis={-29}>
    <PopupMenuTrigger className="mx-4" fixed>
      <FaUserCircle
        size="24"
        className="text-gray-500 hover:text-pink-500
        transition duration-300 ease-in-out cursor-pointer"
      />
    </PopupMenuTrigger>
    <PopupMenu>
      <div className="flex flex-col w-[22vw] h-[65vh] bg-gray-950 rounded-[4px]"></div>
    </PopupMenu>
  </PopupMenuProvider>
);

export default NavigationTopBar;
