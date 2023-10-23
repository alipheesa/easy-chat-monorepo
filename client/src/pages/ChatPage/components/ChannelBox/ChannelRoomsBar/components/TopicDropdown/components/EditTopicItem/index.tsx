import axios from "axios";
import { forwardRef, useState } from "react";
import { API_URLS } from "../../../../../../../../../constants";
import { ContextMenuItem } from "../../../../../../../../../modals/ContextMenu";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeading,
  DialogClose,
  DialogButton,
} from "../../../../../../../../../modals/DefaultModal";
import Input from "../../../../../../NavigationSideBar/components/SettingsButton/components/SettingsModal/content/ProfileSettings/Input";

const EditTopicItem = forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    label: string;
    topicId: number;
  }
>(function EditTopicItem({ topicId, label }) {
  const [topicName, setTopicName] = useState<string>("");

  const onUpdateTopic = () => {
    axios
      .post(
        API_URLS.api.UPDATE_TOPIC(topicId),
        { name: topicName },
        { withCredentials: true }
      )
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
          Topic Settings
        </DialogHeading>
        <Input
          label="Name"
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
            onClick={() => onUpdateTopic()}
          >
            Update Topic
          </DialogButton>
        </div>
      </DialogContent>
    </Dialog>
  );
});

export default EditTopicItem;
