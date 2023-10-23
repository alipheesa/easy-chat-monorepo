import { useNavigate } from "react-router-dom";
import CommonSolidButton from "../CommonSolidButton";
import { RedirectButtonType } from "../types";

const SolidRedirectButton = (props: RedirectButtonType) => {
  const navigate = useNavigate();

  const handleClick = () => navigate(props.to);

  return <CommonSolidButton {...props} onClick={handleClick} />;
};

export default SolidRedirectButton;
