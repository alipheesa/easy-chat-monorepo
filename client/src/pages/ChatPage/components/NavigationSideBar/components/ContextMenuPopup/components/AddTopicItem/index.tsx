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

const ItemAddTopic = forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    label: string;
    groupId: number | string;
  }
>(function ItemAddTopic({ groupId, label, ...props }, ref) {
  const { setGroups } = useChatContext();
  const navigate = useNavigate();
  const location = useLocation();
  const [topicName, setTopicName] = useState<string>("");

  const onAddTopic = () => {
    axios
      .post(
        API_URLS.api.CREATE_TOPIC(),
        { name: topicName, group: groupId },
        { withCredentials: true }
      )
      .then((response) => {
        if (response.status === 200) {
          setGroups((groups) => groups.filter((group) => group.id != groupId));
          if (location.pathname === API_URLS.local.GROUP(groupId)) {
            navigate(API_URLS.local.CHAT_DASHBOARD());
          }
        }
      })
      .catch((e) => console.log(e));
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
      <DialogContent
        className="flex flex-col max-w-[35%] bg-gray-700 rounded-[3px] text-gray-400
                font-sans text-sm"
      >
        <DialogHeading className="mt-4 mb-2 mx-4 text-lg font-semibold">
          Create
        </DialogHeading>
        <DialogDescription className="mb-4 mx-4">
          Topic collects similar rooms in one place. Choose a name and create
          your own!
        </DialogDescription>
        <Input
          placeholder="Topic name"
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setTopicName(event.target.value);
          }}
          value={topicName}
        />
        <div className="flex flex-row bg-gray-800 rounded-[3px] w-full p-4">
          <DialogClose className="hover:underline ml-auto">Cancel</DialogClose>
          <DialogButton
            className="bg-emerald-500 hover:opacity-90 ml-4 rounded-[3px] px-3 py-2
                        transition ease-out duration-150"
            onClick={() => onAddTopic()}
          >
            Create Topic
          </DialogButton>
        </div>
      </DialogContent>
    </Dialog>
  );
});

export default ItemAddTopic;
