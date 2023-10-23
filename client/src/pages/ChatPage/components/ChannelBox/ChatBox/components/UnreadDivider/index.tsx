const UnreadDivider = () => {
  return (
    <div className="flex flex-row w-full">
      <div className="border border-red-500 h-0 rounded-full ml-2 w-full self-center" />
      <p
        className="text-xs bg-red-500 text-white font-bold px-1 self-center border
            border-red-500 h-fit rounded-lg"
      >
        NEW
      </p>
    </div>
  );
};

export default UnreadDivider;
