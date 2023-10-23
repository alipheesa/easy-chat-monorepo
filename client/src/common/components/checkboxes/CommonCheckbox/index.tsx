import { SetStateAction } from "react";

type CommonCheckboxType = {
  text: string;
  parameters?: string;
  value?: boolean;
  setValue?: React.Dispatch<React.SetStateAction<boolean>>;
};

const CommonCheckbox = ({
  text,
  parameters,
  value,
  setValue,
}: CommonCheckboxType) => {
  return (
    <div className={`flex flex-row ${parameters}`}>
      <input
        id="commonCheckbox"
        type={"checkbox"}
        checked={value}
        onChange={() => (setValue ? setValue((prev) => !prev) : undefined)}
        className="w-6 h-6 self-center form-checkbox
            mr-2 cursor-pointer rounded-md focus:ring-0 ring-0 bg-transparent focus:ring-offset-0
            checked:text-emerald-600"
      />
      <label
        htmlFor="commonCheckbox"
        className="text-gray-300 text-sm font-light cursor-pointer
            select-none"
      >
        {text}
      </label>
    </div>
  );
};

export default CommonCheckbox;
