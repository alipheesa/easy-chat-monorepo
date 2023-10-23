import DivWrapper from "../../../../../../../../../../common/components/wrappers/DivWrapper";

const SettingsContentLayout = ({ children }: any) => (
  <DivWrapper
    className="flex flex-col h-full w-full bg-gray-800 rounded-[4px] 
    custom-overflow-y-auto-scroll-customizable border-gray-800 p-4"
  >
    {children}
  </DivWrapper>
);

export default SettingsContentLayout;
