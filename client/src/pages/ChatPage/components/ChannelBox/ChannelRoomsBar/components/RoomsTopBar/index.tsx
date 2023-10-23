import { FaChevronRight } from "react-icons/fa";
import {
  ContextMenuProvider,
  ContextMenuTrigger,
} from "../../../../../../../modals/ContextMenu";
import {
  PopupMenuProvider,
  PopupMenuTrigger,
} from "../../../../../../../modals/DefaultPopupMenu";
import { ContextMenuPopup } from "../../../../NavigationSideBar/components/ContextMenuPopup";
import { useChatContext } from "../../../context";
import { TopBarPopupMenu } from "../TobBarPopupMenu";

export const RoomsTopBar = () => {
  const { currentGroup } = useChatContext();

  return (
    currentGroup && (
      <PopupMenuProvider placement="right-start" alignmentAxis={0} mainAxis={1}>
        <ContextMenuProvider
          arrowEnabled={false}
          alignmentAxis={0}
          mainAxis={1}
        >
          <PopupMenuTrigger
            className="h-16 w-full z-0 bg-gray-800 hover:opacity-[95%] cursor-pointer 
                        shadow-md transition ease-out duration-150 group"
          >
            <ContextMenuTrigger className="flex flex-row h-full w-full items-center">
              <h1
                className="text-lg tracking-wider font-bold text-gray-400 
                            mr-auto ml-4 my-auto align-bottom font-sans"
              >
                {currentGroup.name}
              </h1>
              <FaChevronRight
                size="24"
                className="text-gray-600 rotate-90 mr-4 
                            group-hover:text-gray-400 group-hover:opacity-80 transition ease-out duration-150"
              />
            </ContextMenuTrigger>
          </PopupMenuTrigger>
          <ContextMenuPopup groupId={currentGroup.id} />
          <TopBarPopupMenu />
        </ContextMenuProvider>
      </PopupMenuProvider>
    )
  );
};
