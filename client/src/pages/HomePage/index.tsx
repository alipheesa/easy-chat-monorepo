import { useEffect } from "react";
import { BsGithub } from "react-icons/bs";
import { FcGoogle } from "react-icons/fc";
import OutlineRedirectButton from "../../common/components/buttons/OutlineRedirectButton";
import SocialLoginCircle from "../../common/components/buttons/SocialLoginCircleButton";
import SolidRedirectButton from "../../common/components/buttons/SolidRedirectButton";
import Divider from "../../common/components/dividers/CommonDivider";
import Placeholder from "../../common/components/dividers/Placeholder";
import CommonTitle from "../../common/components/text/CommonTitle";
import { onGithubClick, onGoogleClick } from "../../common/handlers/SocialAuth";
import { API_URLS } from "../../constants";

const HomePage = ({ title }: { title: string }) => {
  useEffect(() => {
    document.title = title;
  }, []);

  return (
    <div className="bg-gray-800 h-screen flex justify-end bg-cover">
      <div
        className="flex flex-col bg-gray-700 self-center rounded-xl w-96
            animate-slide-from-top mr-12 shadow-lg max-h-[90%] custom-overflow-y-auto-scroll"
      >
        <Placeholder className="mb-8" />
        <CommonTitle text="Simple Chat" />
        <Placeholder className="mb-4" />

        <h1 className="text-center font-light text-white self-center w-4/5">
          <p>
            Register in the most popular and the only one chat app within the
            circles of Django amateuers and challenge yourself getting along
            with the pure evil lurking beneath.
          </p>
          <Placeholder className="mb-2" />
          <p>
            Will you dare to attract the attention of Simple Chat mods and
            engage in the deadliest talk you ever experienced?
          </p>
          <Placeholder className="mb-2" />
          <p>Keep chatting for your life!</p>
        </h1>

        <Placeholder className="mb-6" />

        <div className="flex flex-row w-4/5 self-center">
          <SolidRedirectButton
            text="Log In"
            width="w-[45%]"
            to={API_URLS.local.LOGIN()}
          />
          <Placeholder className="mr-auto" />
          <OutlineRedirectButton
            text="Sign Up"
            width="w-[45%]"
            to={API_URLS.local.SIGNUP()}
          />
        </div>

        <Placeholder className="mb-6" />
        <Divider />
        <Placeholder className="mb-6" />

        <div className="flex flex-row self-center justify-center w-4/5">
          <SocialLoginCircle
            handleClick={onGoogleClick}
            icon={<FcGoogle size={"32"} />}
          />
          <Placeholder className="mr-12" />
          <SocialLoginCircle
            handleClick={onGithubClick}
            icon={<BsGithub size={"32"} />}
          />
        </div>

        <Placeholder className="mb-8" />
      </div>
    </div>
  );
};

export default HomePage;
