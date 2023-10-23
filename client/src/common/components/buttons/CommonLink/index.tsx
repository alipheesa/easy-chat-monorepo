import { useNavigate } from "react-router-dom";

type CommonLinkType = {
  text: string;
  to: string;
};

const CommonLink = ({ text, to }: CommonLinkType) => {
  const navigate = useNavigate();

  const handleClick = () => navigate(to);

  return (
    <div
      onClick={handleClick}
      className="text-emerald-500 cursor-pointer hover:underline self-center"
    >
      {text}
    </div>
  );
};

export default CommonLink;
