import { ReactNode, useEffect } from "react";
import { BiAtom } from "react-icons/bi";
import { FaGraduationCap } from "react-icons/fa";
import { IoLogoGameControllerB, IoMdCompass } from "react-icons/io";
import { PiMusicNotesFill, PiTelevision } from "react-icons/pi";
import Placeholder from "../../../../../common/components/dividers/Placeholder";
import { usePublicGroupsContext } from "../context";
import axios from "axios";
import { API_URLS } from "../../../../../constants";

const GroupCategoryBar = () => {
  const { currentCategory, searchQuery, setGroups } = usePublicGroupsContext();

  useEffect(() => {
    if (currentCategory === "Undefined" && searchQuery.length > 0) return;

    setGroups(undefined);

    const url =
      currentCategory === "Undefined"
        ? API_URLS.api.GET_ALL_PUBLIC_GROUPS()
        : API_URLS.api.GET_PUBLIC_GROUPS(currentCategory);

    axios
      .get(url)
      .then(({ data }) => setTimeout(() => setGroups(data), 250))
      .catch(console.log);
  }, [currentCategory]);

  return (
    <div className="flex flex-col w-64 shrink-0 h-full bg-gray-800">
      <Title text="Discover" />
      <Placeholder className="mb-2" />
      <Button
        category="Undefined"
        text="Home"
        icon={<IoMdCompass size="24" />}
      />
      <Button
        category="Gaming"
        text="Gaming"
        icon={<IoLogoGameControllerB size="24" />}
      />
      <Button
        category="Music"
        text="Music"
        icon={<PiMusicNotesFill size="24" />}
      />
      <Button
        category="Education"
        text="Education"
        icon={<FaGraduationCap size="24" />}
      />
      <Button
        category="Science"
        text="Science & Tech"
        icon={<BiAtom size="24" />}
      />
      <Button
        category="Entertainment"
        text="Entertainment"
        icon={<PiTelevision size="24" />}
      />
    </div>
  );
};

const Title = ({ text }: { text: string }) => {
  return (
    <h1
      className="flex items-center px-4 h-16 w-full text-2xl 
        font-bold text-white"
    >
      {text}
    </h1>
  );
};

const Button = ({
  category,
  text,
  icon,
}: {
  category: string;
  text: string;
  icon: ReactNode;
}) => {
  const { currentCategory, setCurrentCategory } = usePublicGroupsContext();

  return (
    <div className="flex w-full h-11 my-0.5">
      <div
        onClick={() => setCurrentCategory(category)}
        className={`flex flex-row w-full h-full mx-3 rounded-[0.25rem] items-center 
                transition duration-150 ease-out cursor-pointer
                ${
                  currentCategory === category
                    ? " bg-emerald-600 hover:bg-emerald-700 text-white"
                    : "text-gray-400 hover:bg-gray-600"
                }`}
      >
        <div className="mx-3">{icon}</div>
        <h1 className="ml-1">{text}</h1>
      </div>
    </div>
  );
};

export default GroupCategoryBar;
