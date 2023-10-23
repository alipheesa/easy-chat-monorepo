import { useState } from "react";
import { FaPlus } from "react-icons/fa";
import { RoomType } from "../../../../../../../constants";
import {
  ContextMenuProvider,
  ContextMenuTrigger,
  ContextMenu,
} from "../../../../../../../modals/ContextMenu";
import { ChevronIcon } from "../ChevronIcon";
import { PopupMenuDivider } from "../PopupMenuDivider";
import PopupMenuItem from "../PopupMenuItem";
import { RoomItem } from "../RoomItem";
import CreateRoomItem from "./components/CreateRoomItem";
import DeleteTopicItem from "./components/DeleteTopicItem";
import EditTopicItem from "./components/EditTopicItem";

export const TopicDropdown = ({
  id,
  header,
  rooms,
}: {
  id: number;
  header: string;
  rooms: Array<RoomType>;
}) => {
  const [expanded, setExpanded] = useState(true);

  const handleAddTopic = (event: React.MouseEvent) => {
    event.stopPropagation();
  };

  return (
    <div
      className="w-full pb-2
        transition duration-300 ease-in-out"
    >
      <ContextMenuProvider arrowEnabled={false}>
        <ContextMenuTrigger asChild>
          <div
            onClick={() => setExpanded((expanded) => !expanded)}
            className="flex flex-row items-center justify-evenly
                    mx-2 mb-2 cursor-pointer text-gray-500 hover:text-gray-400"
          >
            <ChevronIcon expanded={expanded} />
            <h5
              className="text-opacity-90 text-sm 
                        font-semibold select-none transition duration-100 ease-out uppercase
                        mr-auto cursor-pointer font-sans"
            >
              {header}
            </h5>
            <FaPlus
              onClick={(e) => handleAddTopic(e)}
              size="14"
              className="text-opacity-80 my-auto text-gray-500 hover:text-pink-500
                        transition duration-300 ease-in-out cursor-pointer mr-1"
            />
          </div>
        </ContextMenuTrigger>
        <TopicContextMenu topicId={id} />
      </ContextMenuProvider>

      {expanded &&
        rooms &&
        rooms.map((room) => <RoomItem key={room.id} room={room} />)}
    </div>
  );
};

const TopicContextMenu = ({ topicId }: { topicId: number }) => {
  return (
    <ContextMenu>
      <PopupMenuItem text="Marks As Read" disabled />
      <PopupMenuDivider />
      <PopupMenuItem text="Mute Topic" disabled />
      <PopupMenuItem text="Notification Settings" disabled />
      <CreateRoomItem topicId={topicId} label="Create Room" />
      <PopupMenuDivider />
      <EditTopicItem topicId={topicId} label="Edit Topic" />
      <DeleteTopicItem topicId={topicId} label="Delete Topic" />
    </ContextMenu>
  );
};
