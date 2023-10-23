import { useState, useEffect, HTMLProps } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  ContextMenuProvider,
  ContextMenuTrigger,
} from "../../../../../../modals/ContextMenu";
import { Tooltip, TooltipTrigger } from "../../../../../../modals/Tooltip";
import { ContextMenuPopup } from "../ContextMenuPopup";
import { TooltipPopup } from "../TooltipPopup";

interface CommonButtonType extends HTMLProps<HTMLDivElement> {
  icon: React.ReactNode;
  link?: string | number;
  tooltip: string;
  contextMenuEnabled?: boolean;
}

export const CommonButton = (props: CommonButtonType) => {
  const location = useLocation();
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (props.link) {
      setActive(location.pathname === "/chat/" + props.link);
    }
  }, [location]);

  if (props.contextMenuEnabled) {
    return (
      <ContextMenuProvider alignmentAxis={-20} mainAxis={25}>
        <CommonButtonContent active={active} {...props} />
      </ContextMenuProvider>
    );
  }

  return <CommonButtonContent active={active} {...props} />;
};

const CommonButtonContent = ({
  icon,
  link,
  tooltip,
  children,
  active,
  contextMenuEnabled = false,
}: CommonButtonType & { active: boolean }) => {
  const navigate = useNavigate();

  return (
    <Tooltip mainAxis={16}>
      <div className="flex flex-row items-center group">
        <ActiveStatusMark active={active} />

        <HoverStatusMark />

        {children}

        <TooltipTrigger
          onClick={() => (link !== undefined ? navigate(`${link}`) : {})}
          className={`flex justify-center items-center 
                h-12 min-h-[3rem] w-12 mx-auto cursor-pointer 
                shadow-lg select-none overflow-hidden 
                transition-all duration-300 ease-out
                ${
                  active
                    ? "bg-emerald-600 text-white rounded-2xl"
                    : "bg-gray-800 text-emerald-500 hover:text-white \
                rounded-3xl hover:rounded-2xl hover:bg-emerald-600"
                }`}
        >
          {contextMenuEnabled ? (
            <ContextMenuTrigger fixed>{icon}</ContextMenuTrigger>
          ) : (
            icon
          )}
        </TooltipTrigger>

        <TooltipPopup text={tooltip} />

        {contextMenuEnabled && link && (
          <ContextMenuPopup groupId={link as number} />
        )}
      </div>
    </Tooltip>
  );
};

const ActiveStatusMark = ({ active }: { active: boolean }) => (
  <div
    className={`absolute h-8 w-1 bg-white rounded-e-lg origin-left transition
                    duration-150 ease-out ${active ? "" : "scale-0"}`}
  />
);

const HoverStatusMark = () => (
  <div
    className={`absolute h-4 w-1 bg-white rounded-e-lg origin-left transition
                    duration-150 ease-out scale-0 group-hover:scale-100`}
  />
);
