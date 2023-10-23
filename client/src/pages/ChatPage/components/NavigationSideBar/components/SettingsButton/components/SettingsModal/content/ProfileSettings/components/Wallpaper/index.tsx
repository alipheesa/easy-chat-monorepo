const Wallpaper = ({
  wallpaper,
  onClick,
  attributes,
}: {
  wallpaper: string;
  onClick: () => void;
  attributes?: string;
}) => {
  return (
    <div
      className={`flex w-full aspect-[2] shrink-0 rounded-t-[4px] cursor-pointer
        hover:opacity-75 overflow-hidden
        transition ease-out duration-300 ${attributes}`}
    >
      <img
        src={wallpaper}
        className="w-full h-full self-center object-cover"
        onClick={onClick}
      />
    </div>
  );
};

export default Wallpaper;
