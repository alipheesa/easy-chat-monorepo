import { FaFire } from "react-icons/fa";
import { useEffect } from "react";
import Placeholder from "../../../../common/components/dividers/Placeholder";
import Divider from "../../../../common/components/dividers/SidebarDivider";
import { IoMdCompass } from "react-icons/io";
import { GroupType, RoomType } from "../../../../constants";
import { useChatContext } from "../ChannelBox/context";
import { FunctionalButton } from "./components/FunctionalButton";
import { GroupButton } from "./components/GroupButton";
import { GroupAddButton } from "./components/GroupAddButton";
import { SettingsButton } from "./components/SettingsButton";

const NavigationSideBar = () => {
  const { groups, topics, currentGroup, setGroups } = useChatContext();

  useEffect(() => undefined, [groups]);

  useEffect(() => {
    if (topics) {
      const rooms: RoomType[] = Array.prototype.concat(
        ...topics.map((topic) => topic.rooms)
      );
      const rooms_status = rooms.map((room) =>
        room.participant.unread_count === 0 ? true : false
      );
      const all_rooms_read = rooms_status.every((status) => !!status);
      setGroups((groups) =>
        groups.map((group) =>
          group.id === currentGroup?.id
            ? { ...group, is_read: all_rooms_read }
            : group
        )
      );
    }
  }, [topics, currentGroup]);

  return (
    <div className="h-screen w-[4.25rem] shrink-0 flex flex-col bg-gray-900 shadow-lg overflow-y-auto">
      <Placeholder className="pb-3" />

      <FunctionalButton
        icon={<FaFire size="28" />}
        link={"mail"}
        tooltip={"mailbox"}
      />

      <Placeholder className="pb-3" />
      <Divider />
      <Placeholder className="pb-3" />

      {groups.map((group: GroupType) => (
        <div key={group.id}>
          <GroupButton group={group} />
          <Placeholder className="pb-2" />
        </div>
      ))}

      <GroupAddButton />
      <Placeholder className="pb-2" />
      <FunctionalButton
        icon={<IoMdCompass size="24" />}
        link={"groups"}
        tooltip={"explore public groups"}
      />

      <Placeholder className="pb-3" />
      <Divider />
      <Placeholder className="pb-3" />

      <SettingsButton />

      <Placeholder className="pb-3" />
    </div>
  );
};

export default NavigationSideBar;
