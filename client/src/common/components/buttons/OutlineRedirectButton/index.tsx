import { useNavigate } from "react-router-dom";
import CommonOutlineButton from "../CommonOutlineButton";
import { RedirectButtonType } from "../types";

const OutlineRedirectButton = (props: RedirectButtonType) => {
  const navigate = useNavigate();

  const handleClick = () => navigate(props.to);

  return <CommonOutlineButton {...props} onClick={handleClick} />;
};

export default OutlineRedirectButton;
