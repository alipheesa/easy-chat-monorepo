import { CommonButtonType } from "../types";

const CommonOutlineButton = ({
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
        className="text-white w-full h-14 text-lg rounded-lg
            border border-emerald-600 transition duration-200 ease-out 
            hover:bg-emerald-600 hover:shadow-lg"
      >
        {text}
      </button>
    </div>
  );
};

export default CommonOutlineButton;
