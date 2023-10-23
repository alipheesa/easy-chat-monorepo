import axios from "axios";
import { useState, useRef, useEffect, RefObject } from "react";
import { RxCross1 } from "react-icons/rx";
import DivWrapper from "../../../../../../../../common/components/wrappers/DivWrapper";
import { DialogClose } from "../../../../../../../../modals/DefaultModal";
import {
  PopupMenuProvider,
  PopupMenu,
} from "../../../../../../../../modals/DefaultPopupMenu";
import ProfileSettings, { SettingsHandlers } from "./content/ProfileSettings";
import {
  SettingsNavbarItem,
  SettingsCategoryDivider,
  SettingsCategory,
} from "./content/ProfileSettings/components/Common";
import { API_URLS, UserType } from "../../../../../../../../constants";

const SettingsModal = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [currentCategory, setCurrentCategory] =
    useState<SettingsCategory>("profile");
  const [unsaved, setUnsaved] = useState<boolean>(false);
  const [user, setUser] = useState<UserType | null>(null);
  const settingsContentWrapperRef = useRef<HTMLDivElement>(null);
  const settingsContentRef = useRef<SettingsHandlers>(null);

  useEffect(() => {
    setLoading(true);

    axios
      .get(API_URLS.api.GET_USER_PROFILE(), { withCredentials: true })
      .then(({ data }) => setUser(data))
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
          text="Profile"
          category="profile"
          {...NavbarItemProps}
        />
        <SettingsNavbarItem
          disabled
          text="Privacy"
          category="privacy"
          {...NavbarItemProps}
        />
        <SettingsNavbarItem
          disabled
          text="Security"
          category="privacy"
          {...NavbarItemProps}
        />
        <SettingsCategoryDivider />
        <SettingsNavbarItem
          disabled
          text="Groups"
          category="privacy"
          {...NavbarItemProps}
        />
        <SettingsNavbarItem
          disabled
          text="Voice chat"
          category="privacy"
          {...NavbarItemProps}
        />
        <SettingsNavbarItem
          disabled
          text="Users"
          category="privacy"
          {...NavbarItemProps}
        />
        <SettingsCategoryDivider />
        <SettingsNavbarItem
          disabled
          text="Terms of Service"
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

        {!loading && currentCategory === "profile" && user && (
          <ProfileSettings
            ref={settingsContentRef}
            unsaved={unsaved}
            setUnsaved={setUnsaved}
            user={user}
            setUser={setUser}
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

export default SettingsModal;

interface UnsavedChangesPopupProps {
  wrapperRef: RefObject<HTMLDivElement>;
  contentRef: RefObject<SettingsHandlers>;
  unsaved: boolean;
  setUnsaved: (unsaved: boolean) => void;
}

export const UnsavedChangesPopup = ({
  wrapperRef,
  contentRef,
  unsaved,
  setUnsaved,
}: UnsavedChangesPopupProps) => (
  <PopupMenuProvider
    outsidePress={false}
    placement="bottom"
    anchorRef={wrapperRef.current}
    open={unsaved}
  >
    <PopupMenu className="flex justify-center content-center relative w-max">
      <DivWrapper
        className="absolute flex w-[40vw] h-14 bg-gray-950 items-center 
            rounded-[4px] -bottom-6"
      >
        <h1 className="text-white font-sans ml-4 mr-auto">
          Careful - you have unsaved changes!
        </h1>
        <button
          className="hover:underline text-white mr-4 font-sans"
          onClick={() => {
            contentRef.current?.handleReset();
            setUnsaved(false);
          }}
        >
          Reset
        </button>
        <button
          className="px-3 py-2 bg-emerald-600 hover:opacity-80 text-white 
                    font-sans rounded-[4px] mr-4 transition ease-out duration-150"
          onClick={() => {
            contentRef.current?.handleSave();
            setUnsaved(false);
          }}
        >
          Save Changes
        </button>
      </DivWrapper>
    </PopupMenu>
  </PopupMenuProvider>
);
