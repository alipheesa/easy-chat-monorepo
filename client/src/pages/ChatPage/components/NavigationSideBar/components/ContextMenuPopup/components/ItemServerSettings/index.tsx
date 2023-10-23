import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeading,
  DialogDescription,
  DialogClose,
  DialogButton,
} from "../../../../../../../../modals/DefaultModal";
import { useChatContext } from "../../../../../ChannelBox/context";
import { ContextMenuItem } from "../../../../../../../../modals/ContextMenu";
import { API_URLS } from "../../../../../../../../constants";
import { forwardRef, useState } from "react";
import Input from "../../../SettingsButton/components/SettingsModal/content/ProfileSettings/Input";
import ServerSettingsModal from "./ServerSettingsModal";

const ItemServerSettings = forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    label: string;
    groupId: number;
  }
>(function ItemServerSettings({ groupId, label, ...props }, ref) {
  const { setGroups } = useChatContext();
  const navigate = useNavigate();
  const location = useLocation();
  const [topicName, setTopicName] = useState<string>("");

  const onAddTopic = () => {
    // axios
    //   .post(API_URLS.api.LEAVE_GROUP(groupId), {}, { withCredentials: true })
    //   .then((response) => {
    //     if (response.status === 200) {
    //       setGroups((groups) => groups.filter((group) => group.id != groupId));
    //       if (location.pathname === API_URLS.local.GROUP(groupId)) {
    //         navigate(API_URLS.local.CHAT_DASHBOARD());
    //       }
    //     }
    //   })
    //   .catch((e) => console.log(e));
    setTopicName("");
  };

  return (
    <Dialog>
      <DialogTrigger asChild={true}>
        <ContextMenuItem
          label={label}
          color="flex flex-row mb-0.5 p-2 text-gray-400 opacity-90 enabled:hover:bg-emerald-600
          enabled:hover:text-white rounded-[3px] transition ease-out duration-150 text-sm font-sans 
          disabled:opacity-40"
        />
      </DialogTrigger>
      <DialogContent className="flex w-full h-full bg-gray-700 justify-center items-center">
        <ServerSettingsModal groupId={groupId} />
      </DialogContent>
    </Dialog>
  );
});

export default ItemServerSettings;
