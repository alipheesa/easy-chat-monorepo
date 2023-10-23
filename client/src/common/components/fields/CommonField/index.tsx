import { useField } from "formik";
import { FiAlertTriangle } from "react-icons/fi";

export type CommonFieldType = {
  name: string;
  type: string;
  placeholder: string;
};

const CommonField = (props: CommonFieldType) => {
  const [field, meta] = useField(props);

  return (
    <div className="flex flex-col w-4/5 self-center justify-center">
      <div
        className={`flex flex-row w-full h-14 border rounded-lg
            transition duration-300 ease-out
             ${meta.touched && meta.error ? "border-2 border-red-500" : ""}`}
      >
        <input
          {...field}
          {...props}
          className="w-full h-full rounded-lg bg-transparent 
                outline-none text-lg text-white ml-4 placeholder-gray-400"
        />

        <FiAlertTriangle
          size={"32"}
          className={`text-red-500 self-center mr-2 opacity-0
                transition duration-300 ease-out 
                ${meta.touched && meta.error ? "opacity-100" : ""}`}
        />
      </div>

      {meta.touched && meta.error && (
        <h1 className="text-red-500 transition duration-150 ease-out animate-transparent-slide-from-top">
          {meta.error}
        </h1>
      )}
    </div>
  );
};

export default CommonField;
