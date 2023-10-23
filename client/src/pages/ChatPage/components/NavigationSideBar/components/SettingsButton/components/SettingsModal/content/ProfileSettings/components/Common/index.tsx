import { ButtonHTMLAttributes, HTMLProps } from "react";

interface FullNameProps extends HTMLProps<HTMLDivElement> {
  fullName: string;
}

export type SettingsCategory = "profile" | "privacy" | "voice";

export const FullName = ({ fullName, className, ...props }: FullNameProps) => (
  <div
    className={`${className} text-white text-xl font-sans overflow-hidden text-ellipsis 
    whitespace-nowrap`}
    {...props}
  >
    {fullName}
  </div>
);

export const Username = ({
  username,
  className,
  ...props
}: { username: string } & HTMLProps<HTMLDivElement>) => (
  <div
    className={`${className} text-white font-sans overflow-hidden text-ellipsis 
    whitespace-nowrap`}
    {...props}
  >
    {username}
  </div>
);

export const Bio = ({
  bio,
  className,
  ...props
}: { bio: string } & HTMLProps<HTMLDivElement>) => (
  <div className={``} {...props}>
    <div
      className={`${className} text-white font-sans font-semibold uppercase`}
    >
      About me
    </div>
    <div className={`${className} text-white font-sans`}>{bio}</div>
  </div>
);

export const Divider = ({ className, ...props }: HTMLProps<HTMLDivElement>) => (
  <div
    className={`w-[92%] self-center my-1 border border-gray-600 border-b-0 rounded-full 
    ${className}`}
    {...props}
  />
);

interface SettingsNavbarItemProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  text: string;
  category: SettingsCategory;
  current: SettingsCategory;
  setCurrent: (current: SettingsCategory) => void;
}

export const SettingsNavbarItem = ({
  text,
  category,
  current,
  setCurrent,
  ...props
}: SettingsNavbarItemProps) => (
  <button
    onClick={() => setCurrent(category)}
    className={`w-full rounded-[4px] px-4 py-2 
        enabled:hover:bg-gray-900 text-gray-300 disabled:opacity-60 font-sans
        transition ease-out duration-150 
        ${category === current ? "bg-gray-900 hover:opacity-80" : ""}`}
    {...props}
  >
    {text}
  </button>
);

export const SettingsHeader = ({ text }: { text: string }) => (
  <h1 className="text-gray-400 font-sans font-semibold uppercase text-sm mb-2">
    {text}
  </h1>
);

export const SettingsDescription = ({ text }: { text: string }) => (
  <h1 className="text-gray-400 font-sans text-xs mb-2">{text}</h1>
);

export const SettingsCategoryDivider = () => (
  <div className="w-4/5 self-center h-0 border border-gray-600 my-1 rounded-full" />
);

export const SettingsContentDivider = () => (
  <div className="w-full self-center h-0 border border-gray-700 my-1 border-b-0 rounded-full" />
);
