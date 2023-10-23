const DateDivider = ({ date }: { date: string }) => {
  const Divider = () => (
    <div
      className="bg-gray-600 border border-gray-600 opacity-40 rounded-full 
    mx-2 w-full self-center"
    />
  );

  return (
    <div className="flex flex-row w-full justify-evenly">
      <Divider />
      <p className="text-gray-600 opacity-80 px-4 self-center min-w-fit">
        {date}
      </p>
      <Divider />
    </div>
  );
};

export default DateDivider;
