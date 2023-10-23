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
import CommonCheckbox from "../../../../../../../../../../../common/components/checkboxes/CommonCheckbox";
import DivWrapper from "../../../../../../../../../../../common/components/wrappers/DivWrapper";
import {
  UserType,
  API_URLS,
  UpdateGroupAPI,
  GetGroupAPI,
} from "../../../../../../../../../../../constants";
import Button from "../../../../../../SettingsButton/components/SettingsModal/content/Button";
import {
  Divider,
  FullName,
  Username,
  Bio,
} from "../../../../../../SettingsButton/components/SettingsModal/content/ProfileSettings/components/Common";
import IconCropDialog from "../../../../../../SettingsButton/components/SettingsModal/content/ProfileSettings/components/IconCropDialog";
import ProfileIcon from "../../../../../../SettingsButton/components/SettingsModal/content/ProfileSettings/components/ProfileIcon";
import Textarea from "../../../../../../SettingsButton/components/SettingsModal/content/ProfileSettings/components/Textarea";
import Wallpaper from "../../../../../../SettingsButton/components/SettingsModal/content/ProfileSettings/components/Wallpaper";
import WallpaperCropDialog from "../../../../../../SettingsButton/components/SettingsModal/content/ProfileSettings/components/WallpaperCropDialog";
import Input from "../../../../../../SettingsButton/components/SettingsModal/content/ProfileSettings/Input";
import SettingsContentLayout from "../../../../../../SettingsButton/components/SettingsModal/content/SettingsContentLayout";

interface ProfileSettingsContentProps extends HTMLProps<Element> {
  group: GetGroupAPI;
  setGroup: Dispatch<SetStateAction<GetGroupAPI | null>>;
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
>(function ProfileSettings({ group, setGroup, setUnsaved }, propsRef) {
  const [name, setName] = useState<string>("");
  const [icon, setIcon] = useState<string>("");
  const [iconBlob, setIconBlob] = useState<Blob | null>(null);
  const [wallpaper, setWallpaper] = useState<string>("");
  const [wallpaperBlob, setWallpaperBlob] = useState<Blob | null>(null);
  const [category, setCategory] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [isPublic, setIsPublic] = useState<boolean>(group.is_public);

  const inputData = [name, icon, wallpaper, category, description];

  //   const fetchUserData = {
  //     name: user.profile.full_name,
  //     username: user.username,
  //     icon: user.profile.icon,
  //     wallpaper: user.profile.wallpaper,
  //     bio: user.profile.bio,
  //   };

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
    setName("");
    // URL.revokeObjectURL(icon);
    setIcon("");
    setIconBlob(null);
    // URL.revokeObjectURL(wallpaper);
    setWallpaper("");
    setWallpaperBlob(null);
    setCategory("");
    setDescription("");
    setIsPublic(group.is_public);
  };

  const handleSave = () => {
    const data = new FormData();

    if (name) data.append("name", name);
    if (iconBlob) data.append("icon", iconBlob, "icon.jpeg");
    if (wallpaperBlob)
      data.append("wall_image", wallpaperBlob, "wallpaper.jpeg");
    if (description) data.append("description", description);
    if (category) data.append("category", category);
    if (isPublic) data.append("is_public", JSON.stringify(isPublic));

    axios
      .post(API_URLS.api.UPDATE_GROUP(group.id), data, {
        withCredentials: true,
      })
      .then(() => {
        setGroup((group) => {
          return group
            ? Object.assign(
                {},
                group,
                name ? { name: name } : {},
                icon ? { icon: icon } : {},
                wallpaper ? { wallpaper: wallpaper } : {},
                category ? { category: category } : {},
                description ? { description: description } : {},
                isPublic ? { isPublic: isPublic } : {}
              )
            : null;
        });
      })
      .catch(console.log);

    handleReset();
  };

  const handleInputChange = () => {
    const length = Object.values(inputData).join("").length;
    if (length > 0 || isPublic !== group.is_public) {
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
        <DivWrapper className="flex flex-col w-[80%]">
          <Input
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setName(event.target.value);
            }}
            text="Name"
            placeholder={group.name}
            maxLength={35}
            value={name}
          />
          <Divider className="mt-5 mb-3" />
          <Button
            text="Icon"
            buttonText="Change Icon"
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
          <Input
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setCategory(event.target.value);
            }}
            text="Category"
            placeholder={group.category}
            maxLength={35}
            value={category}
          />
          <CommonCheckbox
            text="Is Public"
            parameters="my-6 px-4"
            value={isPublic}
            setValue={setIsPublic}
          />
          <Textarea
            onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => {
              setDescription(event.target.value);
            }}
            text="Group Description"
            maxLength={140}
            value={description}
          />
        </DivWrapper>
        <WallpaperCropDialog
          open={wallpaperModalOpen}
          onOpenChange={setWallpaperModalOpen}
          imgSrc={inputSrc}
          setCroppedImageUrl={setWallpaper}
          setCroppedImageBlob={setWallpaperBlob}
        />
        <IconCropDialog
          open={iconModalOpen}
          onOpenChange={setIconModalOpen}
          imgSrc={inputSrc}
          setCroppedImageUrl={setIcon}
          setCroppedImageBlob={setIconBlob}
        />
      </DivWrapper>
    </SettingsContentLayout>
  );
});

export default ProfileSettings;
