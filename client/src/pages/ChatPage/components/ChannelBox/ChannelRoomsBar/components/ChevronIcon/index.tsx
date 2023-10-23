import { FaChevronRight } from "react-icons/fa";

export const ChevronIcon = ({ expanded }: { expanded: boolean }) => {
  const chevClassName =
    (expanded ? "rotate-90 " : "") +
    "text-opacity-80 my-auto mr-1.5 cursor-pointer transition duration-100 ease-out";

  return <FaChevronRight size="8" className={chevClassName} />;
};
