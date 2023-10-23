import { forwardRef } from "react";

const PopupMenuItem = forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    text: string;
    color?: string;
  }
>(function PopupMenuItem({ text, color, disabled, ...props }, propsRef) {
  return (
    <button
      className={`flex flex-row mb-0.5 p-2 text-gray-400 opacity-90 enabled:hover:bg-emerald-600
        enabled:hover:text-white rounded-[3px] transition ease-out duration-150 text-sm font-sans 
        disabled:opacity-40
        ${color}`}
      disabled={disabled}
    >
      {text}
    </button>
  );
});

export default PopupMenuItem;
