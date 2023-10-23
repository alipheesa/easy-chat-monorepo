import GroupCategoryBar from "./GroupCategoryBar";
import GroupsBox from "./GroupsBox";

const PublicGroupsBox = () => {
  return (
    <div className="flex flex-row w-full h-full">
      <GroupCategoryBar />
      <GroupsBox />
    </div>
  );
};

export default PublicGroupsBox;
