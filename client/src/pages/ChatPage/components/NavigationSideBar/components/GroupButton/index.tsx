import { GroupType } from "../../../../../../constants";
import { CommonButton } from "../CommonButton";
import { GroupIcon } from "../GroupIcon";

export const GroupButton = ({ group }: { group: GroupType }) => {
  const NotificationMark = (
    <div
      className={`absolute h-3 w-1 bg-white rounded-e-lg origin-left transition
                     duration-150 ease-out ${group.is_read ? "scale-0" : ""}`}
    />
  );

  return (
    <CommonButton
      icon={<GroupIcon icon={group.icon} />}
      link={group.id}
      tooltip={group.name}
      contextMenuEnabled={true}
    >
      {NotificationMark}
    </CommonButton>
  );
};
