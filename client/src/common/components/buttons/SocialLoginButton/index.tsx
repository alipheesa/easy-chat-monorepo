type SocialLoginButtonType = {
  icon: JSX.Element;
  text: string;
  handleClick: () => void;
};

const SocialLoginButton = ({
  icon,
  text,
  handleClick,
}: SocialLoginButtonType) => {
  return (
    <div
      onClick={handleClick}
      className="flex flex-row flex-shrink-0 rounded-lg self-center h-14 w-4/5 mx-4 border 
         border-emerald-600 items-center cursor-pointer transition duration-200 ease-out hover:bg-emerald-600"
    >
      {icon}
      <h1 className="text-lg text-white">{text}</h1>
    </div>
  );
};

export default SocialLoginButton;
