import axios from "axios";
import { forwardRef, useState } from "react";
import { DialogItem } from "../..";
import { API_URLS } from "../../../../../../../../constants";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeading,
  DialogClose,
  DialogButton,
  DialogDescription,
} from "../../../../../../../../modals/DefaultModal";
import Input from "../../../SettingsButton/components/SettingsModal/content/ProfileSettings/Input";

const CreateWithoutTemplateItem = forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(function CreateWithoutTemplateItem() {
  const [groupName, setGroupName] = useState<string>("");

  const onCreateRoom = () => {
    axios
      .post(
        API_URLS.api.CREATE_GROUP(),
        { name: groupName },
        { withCredentials: true }
      )
      .catch((e) => console.log(e));

    setGroupName("");
  };

  return (
    <Dialog>
      <DialogTrigger asChild={true}>
        <DialogItem>
          <h1 className="text-white text-lg font-sans animate-pulse">
            Create Without Template
          </h1>
        </DialogItem>
      </DialogTrigger>
      <DialogContent
        className="flex flex-col max-w-[35%] bg-gray-700 rounded-[3px] text-gray-400
                font-sans text-sm"
      >
        <DialogHeading className="mt-4 mb-2 mx-4 text-lg font-semibold">
          Create Group
        </DialogHeading>
        <DialogDescription className="mx-4">
          You can further customize your group in group settings.
        </DialogDescription>
        <Input
          label="Name"
          placeholder="Group name"
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setGroupName(event.target.value);
          }}
          value={groupName}
        />
        <div className="flex flex-row bg-gray-800 rounded-[3px] w-full p-4">
          <DialogClose className="hover:underline ml-auto">Cancel</DialogClose>
          <DialogButton
            className="bg-emerald-500 hover:opacity-90 ml-4 rounded-[3px] px-3 py-2
                        transition ease-out duration-150"
            onClick={() => onCreateRoom()}
          >
            Create Group
          </DialogButton>
        </div>
      </DialogContent>
    </Dialog>
  );
});

export default CreateWithoutTemplateItem;
