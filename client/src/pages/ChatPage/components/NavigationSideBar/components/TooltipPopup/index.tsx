import { TooltipContent } from "../../../../../../modals/Tooltip";

export const TooltipPopup = ({ text }: { text: string }) => (
  <TooltipContent
    className="w-auto py-2 px-3 ml-2 min-w-max rounded-md shadow-lg
        text-gray-400 bg-gray-950 font-sans
        font-semibold select-none z-30"
  >
    {text}
  </TooltipContent>
);
