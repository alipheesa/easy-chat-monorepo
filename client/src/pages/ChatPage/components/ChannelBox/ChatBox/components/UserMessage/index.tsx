interface IUserMessage {
  icon: string;
  username: string;
  time: string;
  text: string;
  isExtension?: boolean;
}

const UserMessage = ({
  icon,
  username,
  time,
  text,
  isExtension = false,
}: IUserMessage) => {
  return (
    <div
      className={`w-full flex flex-row py-1 cursor-pointer 
        ${isExtension ? " my-1.5" : " mt-2.5 mb-1"}`}
    >
      {isExtension ? (
        <div className="w-12 h-full mx-4" />
      ) : (
        <img
          src={icon}
          alt=""
          draggable={false}
          className="w-12 h-full mx-4
            rounded-full shadow-md object-cover opacity-80 hover:opacity-60 hover:shadow-xl
            transition ease-out duration-300 select-none"
        />
      )}

      <div className="w-10/12 flex flex-col justify-start">
        {!isExtension && (
          <p
            className="text-white cursor-pointer transition ease-out duration-300 
                hover:text-pink-300 mr-auto"
          >
            {username}
            <small className="text-xs text-gray-400 opacity-40 ml-2">
              {time}
            </small>
          </p>
        )}
        <p className="text-left text-gray-400 mr-auto whitespace-normal">
          {text}
        </p>
      </div>
    </div>
  );
};

export default UserMessage;
