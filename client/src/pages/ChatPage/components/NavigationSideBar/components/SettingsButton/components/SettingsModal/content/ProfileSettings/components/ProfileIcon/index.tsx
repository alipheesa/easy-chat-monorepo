const ProfileIcon = ({
  icon,
  onClick,
  attributes,
}: {
  icon: string;
  onClick: () => void;
  attributes?: string;
}) => {
  return (
    <div
      className={`flex bg-inherit h-[12vh] aspect-[1] 
            shrink-0 rounded-full overflow-hidden cursor-pointer
            justify-center items-center ${attributes}`}
    >
      <img
        src={icon}
        className="w-[85%] h-[85%] rounded-full object-cover hover:opacity-75 
                    transition ease-out duration-300"
        onClick={onClick}
      />
    </div>
  );
};

export default ProfileIcon;
