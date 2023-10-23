import axios from "axios";
import { useState } from "react";
import { BiSearch } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import Placeholder from "../../../../../common/components/dividers/Placeholder";
import useDebounceEffect from "../../../../../common/hooks/useDebounceEffect";
import { PublicGroupType, API_URLS } from "../../../../../constants";
import { usePublicGroupsContext } from "../context";

const GroupsBox = () => {
  const {
    searchQuery,
    setSearchQuery,
    currentCategory,
    setCurrentCategory,
    setGroups,
  } = usePublicGroupsContext();

  useDebounceEffect(
    () => {
      if (searchQuery.length === 0) return;
      if (currentCategory !== "Undefined") setCurrentCategory("Undefined");

      axios
        .get(API_URLS.api.QUERY_PUBLIC_GROUPS(searchQuery), {
          withCredentials: true,
        })
        .then(({ data }) => setGroups(data))
        .catch(console.log);
    },
    300,
    [searchQuery]
  );

  return (
    <div
      className="flex flex-col w-full h-full bg-gray-700 p-8 scroll-auto 
        custom-overflow-y-auto-scroll"
    >
      <SearchBox searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <Placeholder className="mb-8" />
      <ContentBox />
    </div>
  );
};

const searchBoxHeadingText = "Find your communities on Touhou chat";
const searchBoxDescriptionText =
  "From gaming, to music, to learning, there's a place for you.";

const SearchBox = ({
  searchQuery,
  setSearchQuery,
}: {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}) => {
  return (
    <div
      className="flex flex-col rounded-lg w-full h-[50%] items-center justify-center
        bg-gradient-radial-tr from-[20%] from-transparent to-gray-600 shrink-0"
    >
      <h1 className="text-white font-semibold text-xl pb-1">
        {searchBoxHeadingText}
      </h1>
      <h1 className="text-white pb-4">{searchBoxDescriptionText}</h1>
      <div
        className="flex flex-row bg-white rounded-md w-96 h-11 justify-center items-center
            focus-within:ring-[3px] ring-white ring-opacity-40"
      >
        <input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="rounded-md outline-none w-full h-full ml-4 placeholder-gray-500 
                    placeholder-opacity-70 text-gray-700"
          placeholder="Explore communities"
        />
        <BiSearch
          size="24"
          className="text-gray-500 opacity-70 mx-2 shrink-0"
        />
      </div>
    </div>
  );
};

const ContentBox = () => {
  const { groups } = usePublicGroupsContext();

  return (
    <div className="w-full shrink-0">
      <h1 className="text-white text-xl font-semibold mb-4">
        Featured communities
      </h1>
      <div className="grid grid-cols-groups-box gap-x-4 gap-y-2 w-full h-full">
        {!groups && [...Array(12)].map((e, i) => <CardPlaceholder key={i} />)}
        {groups && groups.length === 0 && (
          <h1 className="text-white font-sant text-lg self-center">
            No Groups Found.
          </h1>
        )}
        {groups &&
          groups.length > 0 &&
          groups.map((group) => <Card key={group.id} group={group} />)}
      </div>
    </div>
  );
};

const Card = ({ group }: { group: PublicGroupType }) => {
  const navigate = useNavigate();

  const handleClick = (groupId: number) => {
    navigate(API_URLS.local.GROUP(groupId));
  };

  return (
    <div onClick={() => handleClick(group.id)} className="relative">
      <div
        className="flex flex-col h-80 w-full rounded-lg cursor-pointer hover:shadow-xl overflow-hidden
            bg-gray-900 transition ease-out duration-200 hover:-translate-y-[1px] group"
      >
        <WallImage url={group.wall_image} />
        <div className="flex flex-col relative w-full h-full px-3.5 pt-7 pb-4">
          <GroupIcon url={group.icon} />
          <Title text={group.name} />
          <Description text={group.description} />
          <div className="mb-auto" />
          <GroupTrafficStatsBox
            onlineCount={group.online_count}
            participantCount={group.participant_count}
          />
        </div>
      </div>
    </div>
  );
};

interface IGroupTrafficStatsBox {
  onlineCount: string;
  participantCount: string;
}

const WallImage = ({ url }: { url: string }) => (
  <div className="w-full h-[45%] overflow-hidden shrink-0">
    <img
      src={url}
      className="w-full h-full transition ease-out object-cover
            duration-200 group-hover:scale-105"
    />
  </div>
);

const GroupIcon = ({ url }: { url: string }) => (
  <img
    src={url}
    className="rounded-2xl h-[3.25rem] w-[3.25rem] absolute -top-8 left-3 
        border-[5px] border-gray-900"
  />
);

const Title = ({ text }: { text: string }) => (
  <h1
    className="text-white font-semibold mb-1 overflow-hidden 
    whitespace-nowrap text-ellipsis"
  >
    {text}
  </h1>
);

const Description = ({ text }: { text: string }) => (
  <h1
    className="text-gray-400 opacity-80 text-xs line-clamp-5 
    overflow-hidden text-ellipsis"
  >
    {text}
  </h1>
);

const GroupTrafficStatsBox = ({
  onlineCount,
  participantCount,
}: IGroupTrafficStatsBox) => (
  <div className="flex flex-row">
    <GroupTrafficStats text={`${onlineCount} Online`} color="bg-green-500" />
    <div className="mr-auto" />
    <GroupTrafficStats
      text={`${participantCount} Members`}
      color="bg-gray-400"
    />
  </div>
);

const GroupTrafficStats = ({
  text,
  color,
}: {
  text: string;
  color: string;
}) => {
  return (
    <div className="flex flex-row items-center">
      <div className={`h-2 w-2 rounded-full mr-1.5 ${color}`} />
      <h1 className="text-gray-400 opacity-80 text-xs font-thin">{text}</h1>
    </div>
  );
};

const CardPlaceholder = () => {
  return (
    <div className="relative">
      <div
        className="flex h-80 w-full rounded-lg bg-gradient-radial-tr from-[20%] 
            from-transparent to-gray-600 animate-pulse"
      ></div>
    </div>
  );
};

export default GroupsBox;
