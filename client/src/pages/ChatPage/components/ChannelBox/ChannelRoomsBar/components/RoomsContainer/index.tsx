import { TopicType } from "../../../../../../../constants";
import { useChatContext } from "../../../context";
import { TopicDropdown } from "../TopicDropdown";

export const RoomsContainer = () => {
  const { topics } = useChatContext();

  return (
    <div
      className="flex flex-col w-full h-full
        bg-gray-800 overflow-y-auto"
    >
      <div className="pb-6" />

      {topics &&
        topics.map((topic: TopicType) => (
          <TopicDropdown
            key={topic.id}
            id={topic.id}
            header={topic.name}
            rooms={topic.rooms}
          />
        ))}
    </div>
  );
};
