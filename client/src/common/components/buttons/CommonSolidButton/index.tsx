import { CommonButtonType } from "../types";

const CommonSolidButton = ({
  text,
  disabled = false,
  type = "button",
  width = "w-4/5",
  onClick = () => undefined,
}: CommonButtonType) => {
  return (
    <div onClick={onClick} className={`flex flex-row self-center ${width}`}>
      <button
        disabled={disabled}
        type={type}
        className="text-white w-full h-14 text-lg 
            bg-emerald-600 rounded-lg shadow-lg disabled:bg-gray-600 disabled:animate-pulse
            transition duration-200 ease-out hover:opacity-90"
      >
        {text}
      </button>
    </div>
  );
};

export default CommonSolidButton;
