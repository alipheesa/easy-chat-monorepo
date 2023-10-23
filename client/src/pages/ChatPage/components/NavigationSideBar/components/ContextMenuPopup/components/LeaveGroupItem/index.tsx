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
import { forwardRef } from "react";

const dialogHeadingText = "Leave";
const dialogDescriptionText = `Are you sure you want to leave? 
                               You won't be able to rejoin this server unless you are re-invited.`;
const dialogButtonText = "Leave Server";

const ItemLeaveGroup = forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    label: string;
    groupId: number | string;
  }
>(function ItemLeaveGroup({ groupId, label, ...props }, ref) {
  const { setGroups } = useChatContext();
  const navigate = useNavigate();
  const location = useLocation();

  const onLeaveServer = () => {
    axios
      .post(API_URLS.api.LEAVE_GROUP(groupId), {}, { withCredentials: true })
      .then((response) => {
        if (response.status === 200) {
          setGroups((groups) => groups.filter((group) => group.id != groupId));
          if (location.pathname === API_URLS.local.GROUP(groupId)) {
            navigate(API_URLS.local.CHAT_DASHBOARD());
          }
        }
      })
      .catch((e) => console.log(e));
  };

  return (
    <Dialog>
      <DialogTrigger asChild={true}>
        <ContextMenuItem
          label={label}
          color="text-red-500 enabled:hover:bg-red-500"
        />
      </DialogTrigger>
      <DialogContent
        className="flex flex-col max-w-[35%] bg-gray-700 rounded-[3px] text-gray-400
                font-sans text-sm"
      >
        <DialogHeading className="mt-4 mb-2 mx-4 text-lg font-semibold">
          {dialogHeadingText}
        </DialogHeading>
        <DialogDescription className="mb-4 mx-4">
          {dialogDescriptionText}
        </DialogDescription>
        <div className="flex flex-row bg-gray-800 rounded-[3px] w-full p-4">
          <DialogClose className="hover:underline ml-auto">Cancel</DialogClose>
          <DialogButton
            className="bg-red-500 hover:bg-[#f23838] ml-4 rounded-[3px] px-3 py-2
                        transition ease-out duration-150"
            onClick={() => onLeaveServer()}
          >
            {dialogButtonText}
          </DialogButton>
        </div>
      </DialogContent>
    </Dialog>
  );
});

export default ItemLeaveGroup;
