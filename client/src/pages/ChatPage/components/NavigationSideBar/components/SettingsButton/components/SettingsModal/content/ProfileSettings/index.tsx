import axios from "axios";
import {
  HTMLProps,
  forwardRef,
  useState,
  useImperativeHandle,
  useRef,
  RefObject,
  useEffect,
  SetStateAction,
  Dispatch,
} from "react";
import DivWrapper from "../../../../../../../../../../common/components/wrappers/DivWrapper";
import { API_URLS, UserType } from "../../../../../../../../../../constants";
import Button from "../Button";
import SettingsContentLayout from "../SettingsContentLayout";
import { Divider, FullName, Username, Bio } from "./components/Common";
import IconCropDialog from "./components/IconCropDialog";
import ProfileIcon from "./components/ProfileIcon";
import Textarea from "./components/Textarea";
import Wallpaper from "./components/Wallpaper";
import WallpaperCropDialog from "./components/WallpaperCropDialog";
import Input from "./Input";

interface ProfileSettingsContentProps extends HTMLProps<Element> {
  user: UserType;
  setUser: Dispatch<SetStateAction<UserType | null>>;
  unsaved: boolean;
  setUnsaved: (open: boolean) => void;
}

export interface SettingsHandlers {
  handleReset: () => void;
  handleSave: () => void;
}

const ProfileSettings = forwardRef<
  SettingsHandlers,
  ProfileSettingsContentProps
>(function ProfileSettings({ user, setUser, setUnsaved }, propsRef) {
  const [fullName, setFullName] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [icon, setIcon] = useState<string>("");
  const [iconBlob, setIconBlob] = useState<Blob | null>(null);
  const [wallpaper, setWallpaper] = useState<string>("");
  const [wallpaperBlob, setWallpaperBlob] = useState<Blob | null>(null);
  const [bio, setBio] = useState<string>("");
  const inputData = [fullName, username, icon, wallpaper, bio];

  const fetchUserData = {
    fullName: user.profile.full_name,
    username: user.username,
    icon: user.profile.icon,
    wallpaper: user.profile.wallpaper,
    bio: user.profile.bio,
  };

  const iconInputRef = useRef<HTMLInputElement>(null);
  const wallpaperInputRef = useRef<HTMLInputElement>(null);
  const [inputSrc, setInputSrc] = useState<string>("");
  const [iconModalOpen, setIconModalOpen] = useState<boolean>(false);
  const [wallpaperModalOpen, setWallpaperModalOpen] = useState<boolean>(false);

  useImperativeHandle(propsRef, () => ({
    handleReset: () => handleReset(),
    handleSave: () => handleSave(),
  }));

  useEffect(() => handleInputChange());

  const handleReset = () => {
    setFullName("");
    setUsername("");
    // URL.revokeObjectURL(icon);
    setIcon("");
    setIconBlob(null);
    // URL.revokeObjectURL(wallpaper);
    setWallpaper("");
    setWallpaperBlob(null);
    setBio("");
  };

  const handleSave = () => {
    const data = new FormData();

    if (username) data.append("username", username);
    if (fullName) data.append("full_name", fullName);
    if (bio) data.append("bio", bio);
    if (iconBlob) data.append("icon", iconBlob, "icon.jpeg");
    if (wallpaperBlob)
      data.append("wallpaper", wallpaperBlob, "wallpaper.jpeg");

    axios
      .post(API_URLS.api.UPDATE_USER_PROFILE(), data, {
        withCredentials: true,
      })
      .then(() => {
        setUser((user) => {
          return user
            ? Object.assign({}, user, username ? { username: username } : {}, {
                profile: Object.assign(
                  user.profile,
                  fullName ? { full_name: fullName } : {},
                  bio ? { bio: bio } : {},
                  icon ? { icon: icon } : {},
                  wallpaper ? { wallpaper: wallpaper } : {}
                ),
              })
            : null;
        });
      })
      .catch(console.log);

    handleReset();
  };

  const handleInputChange = () => {
    const length = Object.values(inputData).join("").length;
    if (length > 0) {
      setUnsaved(true);
    } else {
      setUnsaved(false);
    }
  };

  const onSelect = (
    inputRef: RefObject<HTMLInputElement>,
    setModalOpen: (open: boolean) => void
  ) => {
    URL.revokeObjectURL(inputSrc);
    if (inputRef.current?.files?.length === 1) {
      setModalOpen(true);
      setInputSrc(URL.createObjectURL(inputRef.current.files[0]));
      inputRef.current.value = "";
    }
  };

  return (
    <SettingsContentLayout>
      <DivWrapper className="flex flex-row w-full pb-12">
        <DivWrapper className="flex flex-col w-[40%]">
          <Input
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setFullName(event.target.value);
            }}
            text="Full Name"
            placeholder={user.profile.full_name}
            maxLength={45}
            value={fullName}
          />
          <Divider className="mt-5 mb-3" />
          <Input
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setUsername(event.target.value);
            }}
            text="Username"
            placeholder={user.username}
            maxLength={45}
            value={username}
          />
          <Divider className="mt-5 mb-3" />
          <Button
            text="Avatar"
            buttonText="Change Avatar"
            onClick={() => {
              iconInputRef.current?.click();
            }}
          />
          <input
            type="file"
            ref={iconInputRef}
            accept="image/*"
            onChange={() => onSelect(iconInputRef, setIconModalOpen)}
            className="hidden"
          />
          <Divider className="mt-5 mb-3" />
          <Button
            text="Wallpaper"
            buttonText="Change Wallpaper"
            onClick={() => {
              wallpaperInputRef.current?.click();
            }}
          />
          <input
            type="file"
            ref={wallpaperInputRef}
            accept="image/*"
            onChange={() => onSelect(wallpaperInputRef, setWallpaperModalOpen)}
            className="hidden"
          />
          <Divider className="mt-5 mb-3" />
          <Textarea
            onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => {
              setBio(event.target.value);
            }}
            text="About Me"
            description="Markdown and links are currently disabled but will be added soon!"
            maxLength={500}
            value={bio}
          />
        </DivWrapper>
        <DivWrapper
          className="flex flex-col ml-auto h-[70vh] w-[25vw] shrink-0 
                    rounded-md bg-gray-900 overflow-hidden shadow-xl sticky top-0"
        >
          <Wallpaper
            wallpaper={wallpaper ? wallpaper : fetchUserData.wallpaper}
            onClick={() => {
              wallpaperInputRef.current?.click();
            }}
          />
          <WallpaperCropDialog
            open={wallpaperModalOpen}
            onOpenChange={setWallpaperModalOpen}
            imgSrc={inputSrc}
            setCroppedImageUrl={setWallpaper}
            setCroppedImageBlob={setWallpaperBlob}
          />
          <div className="flex flex-col relative bg-inherit">
            <ProfileIcon
              icon={icon ? icon : fetchUserData.icon}
              onClick={() => {
                iconInputRef.current?.click();
              }}
              attributes="absolute -top-[6vh] left-[5%]"
            />
            <IconCropDialog
              open={iconModalOpen}
              onOpenChange={setIconModalOpen}
              imgSrc={inputSrc}
              setCroppedImageUrl={setIcon}
              setCroppedImageBlob={setIconBlob}
            />
            <FullName
              fullName={fullName ? fullName : fetchUserData.fullName}
              className="mt-[1%] ml-[35%]"
            />
            <Username
              username={username ? username : fetchUserData.username}
              className="mt-[1%] ml-[35%]"
            />
            <Divider />
          </div>
          <div
            className="flex flex-col flex-1 custom-overflow-y-auto-scroll-customizable 
                     border-gray-900"
          >
            <Bio bio={bio ? bio : fetchUserData.bio} className="ml-[4%]" />
          </div>
        </DivWrapper>
      </DivWrapper>
    </SettingsContentLayout>
  );
});

export default ProfileSettings;
