import { InputProps } from "../../Input";
import { SettingsHeader, SettingsDescription } from "../Common";

interface TextareaProps extends Omit<InputProps, "onChange"> {
  description?: string;
  onChange: React.FormEventHandler<HTMLTextAreaElement> | undefined;
}

const Textarea = ({
  text,
  description,
  placeholder,
  onChange,
  maxLength,
  name,
  value,
  ...props
}: TextareaProps) => (
  <div
    className="w-full rounded-[4px] px-4 py-2 text-gray-300 font-sans"
    {...props}
  >
    {text && <SettingsHeader text={text} />}
    {description && <SettingsDescription text={description} />}
    <div className="w-full h-48 bg-gray-900 rounded-[4px] px-3 py-1">
      <textarea
        className="bg-transparent w-full h-full focus:outline-none placeholder:text-gray-500
                text-xs resize-none"
        name={name}
        placeholder={placeholder}
        maxLength={maxLength}
        onChange={onChange}
        value={value}
      />
    </div>
  </div>
);

export default Textarea;
