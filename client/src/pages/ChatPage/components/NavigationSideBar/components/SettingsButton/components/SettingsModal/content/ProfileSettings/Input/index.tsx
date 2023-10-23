import { HTMLProps } from "react";
import { SettingsHeader } from "../components/Common";

export interface InputProps extends HTMLProps<HTMLDivElement> {
  text?: string;
  placeholder?: string;
  onChange?: React.FormEventHandler<HTMLInputElement> | undefined;
}

const Input = ({
  text,
  placeholder,
  maxLength,
  value,
  onChange = undefined,
  ...props
}: InputProps) => (
  <div
    className="w-full rounded-[4px] px-4 py-2 text-gray-300 font-sans"
    {...props}
  >
    {text && <SettingsHeader text={text} />}
    <div className="w-full h-12 bg-gray-900 rounded-[4px] px-3">
      <input
        type="text"
        className="bg-transparent w-full h-full focus:outline-none placeholder:text-gray-500"
        placeholder={placeholder}
        maxLength={maxLength}
        onChange={onChange}
        autoComplete={"off"}
        value={value}
      />
    </div>
  </div>
);

export default Input;
