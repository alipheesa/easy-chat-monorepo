import { HTMLProps } from "react";
import { SettingsHeader } from "../ProfileSettings/components/Common";

const Button = ({
  text,
  buttonText,
  onClick,
  ...props
}: { text: string; buttonText: string } & HTMLProps<HTMLDivElement>) => (
  <div
    className="w-full rounded-[4px] px-4 py-2 text-gray-300 font-sans"
    {...props}
  >
    <SettingsHeader text={text} />
    <div
      onClick={onClick}
      className="flex w-[70%] min-w-fit h-12 bg-emerald-600 rounded-[4px] px-4 py-2
        text-white font-sans uppercase font-semibold items-center justify-center text-xs
        hover:opacity-70 transition ease-out duration-300 cursor-pointer"
    >
      {buttonText}
    </div>
  </div>
);

export default Button;
