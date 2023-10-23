import axios from "axios";
import { Form, Formik } from "formik";
import { useEffect } from "react";
import { BsGithub } from "react-icons/bs";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import CommonLink from "../../common/components/buttons/CommonLink";
import CommonSolidButton from "../../common/components/buttons/CommonSolidButton";
import SocialLoginButton from "../../common/components/buttons/SocialLoginButton";
import Divider from "../../common/components/dividers/CommonDivider";
import Placeholder from "../../common/components/dividers/Placeholder";
import CommonField from "../../common/components/fields/CommonField";
import CommonTitle from "../../common/components/text/CommonTitle";
import { onGithubClick, onGoogleClick } from "../../common/handlers/SocialAuth";

import { API_URLS, LoginAPI } from "../../constants";

const LoginPage = ({ title }: { title: string }) => {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = title;
  }, []);

  const handleSubmit = (
    values: { emailOrUsername: string; password: string },
    setSubmitting: (submitting: boolean) => void
  ) => {
    setSubmitting(true);

    const request: LoginAPI = {
      password: values.password,
      email: "",
      username: "",
    };

    if (values.emailOrUsername.includes("@")) {
      request.email = values.emailOrUsername;
    } else {
      request.username = values.emailOrUsername;
    }

    axios
      .post(API_URLS.api.LOGIN(), request, { withCredentials: true })
      .then((response) => {
        if (response.status === 200) navigate(API_URLS.local.CHAT_DASHBOARD());
        else console.log(response);
      })
      .catch(console.log)
      .finally(() => setSubmitting(false));
  };

  return (
    <div className="bg-gray-800 h-screen flex justify-end bg-cover">
      <Formik
        initialValues={{
          emailOrUsername: "",
          password: "",
        }}
        validationSchema={Yup.object({
          emailOrUsername: Yup.string()
            .max(35, "Must be 35 characters or less")
            .required("Required"),
          password: Yup.string().required("Required"),
        })}
        onSubmit={(values, { setSubmitting }) => {
          handleSubmit(values, setSubmitting);
        }}
      >
        {({ isSubmitting }) => <FormWindow isSubmitting={isSubmitting} />}
      </Formik>
    </div>
  );
};

export default LoginPage;

const FormWindow = ({ isSubmitting }: { isSubmitting: boolean }) => (
  <Form
    className="flex flex-col bg-gray-700 self-center rounded-xl w-96 max-h-[90%]
    justify-center mr-12 shadow-lg custom-overflow-y-auto-scroll"
  >
    <Placeholder className="mb-8" />
    <CommonTitle text="Simple Chat" />
    <Placeholder className="mb-6" />

    <CommonField
      name="emailOrUsername"
      type="username"
      placeholder="Email or username"
    />
    <Placeholder className="mb-4" />
    <CommonField name="password" type="password" placeholder="Password" />
    <Placeholder className="mb-4" />
    <CommonSolidButton text="Log In" type="submit" disabled={isSubmitting} />
    <Placeholder className="mb-2" />

    <CommonLink text="Forgot password?" to={API_URLS.local.RESET_PASSWORD()} />

    <Placeholder className="mb-4" />
    <Divider />
    <Placeholder className="mb-4" />

    <SocialLoginButton
      handleClick={onGoogleClick}
      icon={<FcGoogle size={"28"} className="mx-4" />}
      text="Continue with Google"
    />
    <Placeholder className="mb-4" />
    <SocialLoginButton
      handleClick={onGithubClick}
      icon={<BsGithub size={"28"} className="mx-4" />}
      text="Continue with Github"
    />

    <Placeholder className="mb-8" />
  </Form>
);
