import axios from "axios";
import { Form, Formik } from "formik";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Placeholder from "../../common/components/dividers/Placeholder";
import CommonField from "../../common/components/fields/CommonField";
import CommonTitle from "../../common/components/text/CommonTitle";
import { API_URLS, SignupAPI } from "../../constants";
import * as Yup from "yup";
import CommonSolidButton from "../../common/components/buttons/CommonSolidButton";
import CommonCheckbox from "../../common/components/checkboxes/CommonCheckbox";

const SignupPage = ({ title }: { title: string }) => {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = title;
  }, []);

  const handleSubmit = (
    values: SignupAPI,
    setSubmitting: (submitting: boolean) => void
  ) => {
    setSubmitting(true);
    axios
      .post(API_URLS.api.SIGNUP(), values, { withCredentials: true })
      .then((response) =>
        response.status === 201
          ? navigate(API_URLS.local.LOGIN())
          : console.log(response)
      )
      .catch(console.log)
      .finally(() => setSubmitting(false));
  };

  return (
    <div className="bg-gray-800 h-screen flex justify-end bg-cover">
      <Formik
        initialValues={{
          username: "",
          email: "",
          full_name: "",
          password1: "",
          password2: "",
        }}
        validationSchema={Yup.object({
          username: Yup.string()
            .min(5, "Must be at least 5 characters long")
            .max(35, "Must be 35 characters or less")
            .required("Required"),
          email: Yup.string(),
          full_name: Yup.string().required("Required"),
          password1: Yup.string().required("Required"),
          password2: Yup.string().required("Required"),
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

export default SignupPage;

const FormWindow = ({ isSubmitting }: { isSubmitting: boolean }) => (
  <Form
    className="flex flex-col bg-gray-700 self-center rounded-xl w-96 max-h-[90%] 
    mr-12 shadow-lg custom-overflow-y-auto-scroll"
  >
    <Placeholder className="mb-8" />
    <CommonTitle text="Simple Chat" />
    <Placeholder className="mb-6" />

    <CommonField name="username" type="username" placeholder="Username" />
    <Placeholder className="mb-4" />
    <CommonField
      name="full_name"
      type="username"
      placeholder="Displayed name"
    />
    <Placeholder className="mb-4" />
    <CommonField name="email" type="email" placeholder="Email (optional)" />
    <Placeholder className="mb-4" />
    <CommonField name="password1" type="password" placeholder="Password" />
    <Placeholder className="mb-4" />
    <CommonField
      name="password2"
      type="password"
      placeholder="Repeat password"
    />
    <Placeholder className="mb-4" />
    <CommonCheckbox
      text="(Optional) Send me emails with Simple Chat updates, tips and special offers."
      parameters="w-4/5 self-center"
    />
    <Placeholder className="mb-4" />
    <CommonSolidButton text="Sign Up" type="submit" disabled={isSubmitting} />
    <Placeholder className="mb-1" />

    <TermsOfServiceParagraph />

    <Placeholder className="mb-8" />
  </Form>
);

const TermsOfServiceParagraph = () => (
  <p className="text-gray-300 text-sm font-light self-center w-4/5 select-none">
    {`By registering, you agree to Tohou chat's`}{" "}
    <span className="text-emerald-500 hover:underline hover:cursor-pointer">
      Terms of Service
    </span>{" "}
    and{" "}
    <span className="text-emerald-500 hover:underline hover:cursor-pointer">
      Privacy Policy
    </span>
    .
  </p>
);
