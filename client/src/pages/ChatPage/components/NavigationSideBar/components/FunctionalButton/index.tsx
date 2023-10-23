import { CommonButton } from "../CommonButton";

export const FunctionalButton = ({
  icon,
  link,
  tooltip,
}: {
  icon: React.ReactNode;
  link?: string;
  tooltip: string;
}) => {
  return (
    <CommonButton
      icon={icon}
      link={link ? `${link}` : link}
      tooltip={tooltip}
    />
  );
};
