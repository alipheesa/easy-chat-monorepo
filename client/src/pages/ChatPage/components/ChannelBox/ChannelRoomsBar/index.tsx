import { RoomsContainer } from "./components/RoomsContainer";
import { RoomsTopBar } from "./components/RoomsTopBar";

const ChannelRoomsBar = () => {
  return (
    <div className="flex flex-col w-64 h-full shrink-0">
      <RoomsTopBar />
      <RoomsContainer />
    </div>
  );
};

export default ChannelRoomsBar;
