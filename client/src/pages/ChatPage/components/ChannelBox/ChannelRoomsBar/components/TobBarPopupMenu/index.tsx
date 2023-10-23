import { PopupMenu } from "../../../../../../../modals/DefaultPopupMenu";
import ItemAddTopic from "../../../../NavigationSideBar/components/ContextMenuPopup/components/AddTopicItem";
import ItemDeleteGroup from "../../../../NavigationSideBar/components/ContextMenuPopup/components/DeleteGroupItem";
import { useChatContext } from "../../../context";
import { PopupMenuDivider } from "../PopupMenuDivider";
import PopupMenuItem from "../PopupMenuItem";

export const TopBarPopupMenu = () => {
  const { currentGroup } = useChatContext();

  if (!currentGroup) return <></>;

  return (
    <PopupMenu className="flex flex-col bg-gray-950 rounded-[3px] p-2.5 pb-1 min-w-[12rem]">
      <PopupMenuItem text="Invite People" disabled />
      <PopupMenuDivider />
      <PopupMenuItem text="Server Settings" disabled />
      <ItemAddTopic label="Create Topic" groupId={currentGroup.id} />
      <PopupMenuItem text="Create Room" disabled />
      <PopupMenuDivider />
      <PopupMenuItem text="Notification Settings" disabled />
      <PopupMenuItem text="Privacy Settings" disabled />
      <PopupMenuDivider />
      <PopupMenuItem text="Edit Server Profile" disabled />
      <ItemDeleteGroup label="Delete Server" groupId={currentGroup.id} />
    </PopupMenu>
  );
};
