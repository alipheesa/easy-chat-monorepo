import { BsGearFill } from "react-icons/bs";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
} from "../../../../../../modals/DefaultModal";
import { FunctionalButton } from "../FunctionalButton";
import SettingsModal from "./components/SettingsModal";

export const SettingsButton = () => {
  return (
    <Dialog>
      <DialogTrigger>
        <FunctionalButton
          icon={<BsGearFill size="20" />}
          tooltip={"settings"}
        />
      </DialogTrigger>
      <DialogContent className="flex w-full h-full bg-gray-700 justify-center items-center">
        <SettingsModal />
      </DialogContent>
    </Dialog>
  );
};
