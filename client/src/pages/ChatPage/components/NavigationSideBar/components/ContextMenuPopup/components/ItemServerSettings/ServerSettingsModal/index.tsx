import axios from "axios";
import { useState, useRef, useEffect } from "react";
import { RxCross1 } from "react-icons/rx";
import DivWrapper from "../../../../../../../../../common/components/wrappers/DivWrapper";
import {
  API_URLS,
  GetGroupAPI,
  UpdateGroupAPI,
} from "../../../../../../../../../constants";
import { DialogClose } from "../../../../../../../../../modals/DefaultModal";
import { UnsavedChangesPopup } from "../../../../SettingsButton/components/SettingsModal";
import { SettingsHandlers } from "../../../../SettingsButton/components/SettingsModal/content/ProfileSettings";
import {
  SettingsCategory,
  SettingsNavbarItem,
} from "../../../../SettingsButton/components/SettingsModal/content/ProfileSettings/components/Common";
import ServerProfileSettings from "./settings/ServerProfileSettings";

const ServerSettingsModal = ({ groupId }: { groupId: number }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [currentCategory, setCurrentCategory] =
    useState<SettingsCategory>("profile");
  const [unsaved, setUnsaved] = useState<boolean>(false);
  const [group, setGroup] = useState<GetGroupAPI | null>(null);
  const settingsContentWrapperRef = useRef<HTMLDivElement>(null);
  const settingsContentRef = useRef<SettingsHandlers>(null);

  useEffect(() => {
    setLoading(true);

    axios
      .get(API_URLS.api.UPDATE_GROUP(groupId), { withCredentials: true })
      .then(({ data }) => setGroup(data))
      .catch(() => console.log)
      .finally(() => setTimeout(() => setLoading(false), 300));
  }, []);

  const NavbarItemProps = {
    current: currentCategory,
    setCurrent: setCurrentCategory,
  };

  return (
    <DivWrapper className="flex flex-row w-[70%] h-[80%] relative">
      <DialogClose
        className="flex flex-row items-center justify-center absolute w-10 h-10 
                  rounded-full border-2 border-gray-600 cursor-pointer -right-16 hover:opacity-60
                  transition ease-out duration-150"
      >
        <RxCross1 size="25" className="text-gray-600" />
      </DialogClose>

      <DivWrapper
        className="flex flex-col h-full w-48 bg-gray-800 rounded-[4px] 
                  shrink-0 p-1 mr-8"
      >
        <SettingsNavbarItem
          text="Common"
          category="profile"
          {...NavbarItemProps}
        />
        <SettingsNavbarItem
          disabled
          text="Privacy"
          category="privacy"
          {...NavbarItemProps}
        />
      </DivWrapper>

      <DivWrapper
        ref={settingsContentWrapperRef}
        className="flex h-full w-full bg-gray-800 
                  rounded-[4px] justify-center items-center overflow-y-auto"
      >
        {loading && <div className="bars-loading-animation" />}

        {!loading && currentCategory === "profile" && group && (
          <ServerProfileSettings
            ref={settingsContentRef}
            unsaved={unsaved}
            setUnsaved={setUnsaved}
            group={group}
            setGroup={setGroup}
          />
        )}
      </DivWrapper>

      <UnsavedChangesPopup
        wrapperRef={settingsContentWrapperRef}
        contentRef={settingsContentRef}
        unsaved={unsaved}
        setUnsaved={setUnsaved}
      />
    </DivWrapper>
  );
};

export default ServerSettingsModal;
