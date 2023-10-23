type SocialLoginCircleButtonType = {
  icon: JSX.Element;
  handleClick: () => void;
};

const SocialLoginCircle = ({
  icon,
  handleClick,
}: SocialLoginCircleButtonType) => {
  return (
    <div
      onClick={handleClick}
      className="flex rounded-full self-center aspect-square w-[20%] border border-emerald-600 bg-cover
           items-center justify-center cursor-pointer transition duration-200 ease-out 
           hover:bg-emerald-600 hover:shadow-lg"
    >
      {icon}
    </div>
  );
};

export default SocialLoginCircle;
