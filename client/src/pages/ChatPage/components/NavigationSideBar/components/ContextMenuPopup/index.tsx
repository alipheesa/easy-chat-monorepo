import {
  ContextMenu,
  ContextMenuItem,
  ContextMenuDivider,
} from "../../../../../../modals/ContextMenu";
import ItemAddTopic from "./components/AddTopicItem";
import ItemServerSettings from "./components/ItemServerSettings";
import ItemLeaveGroup from "./components/LeaveGroupItem";

export const ContextMenuPopup = ({ groupId }: { groupId: number }) => {
  return (
    <ContextMenu>
      <ContextMenuItem label="Mark As Read" disabled />
      <ContextMenuDivider />
      <ContextMenuItem label="Invite People" disabled />
      <ContextMenuDivider />
      <ContextMenuItem label="Mute Server" disabled />
      <ContextMenuItem label="Notification Settings" disabled />
      <ContextMenuItem label="Hide Muted Channels" disabled />
      <ContextMenuDivider />
      <ItemServerSettings label="Server Settings" groupId={groupId} />
      <ContextMenuItem label="Privacy Settings" disabled />
      <ContextMenuItem label="Edit Server Profile" disabled />
      <ContextMenuDivider />
      <ItemAddTopic label="Create Topic" groupId={groupId} />
      <ContextMenuItem label="Create Room" disabled />
      <ContextMenuItem label="Create Event" disabled />
      <ContextMenuDivider />
      <ItemLeaveGroup label="Leave Server" groupId={groupId} />
    </ContextMenu>
  );
};
