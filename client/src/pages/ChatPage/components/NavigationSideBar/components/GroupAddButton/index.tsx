import { forwardRef } from "react";
import { BsPlus } from "react-icons/bs";
import { RxCross1 } from "react-icons/rx";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeading,
  DialogDescription,
  DialogClose,
  DialogButton,
} from "../../../../../../modals/DefaultModal";
import { FunctionalButton } from "../FunctionalButton";
import CreateWithoutTemplateItem from "./components/CreateWithoutTemplateItem";

export const GroupAddButton = () => (
  <Dialog>
    <DialogTrigger>
      <FunctionalButton icon={<BsPlus size="32" />} tooltip={"add group"} />
    </DialogTrigger>
    <DialogContent
      className="flex flex-col relative min-w-[24rem] max-w-[35%] bg-gray-700 rounded-[4px] text-gray-400
            font-sans text-sm max-h-[90%]"
    >
      <DialogClose
        className="flex items-center justify-center absolute w-8 h-8 
            rounded-full bg-gray-800 cursor-pointer top-2 right-2 hover:opacity-60
            transition ease-out duration-150"
      >
        <RxCross1 size="24" className="text-gray-700" />
      </DialogClose>
      <DivWrapper className="mx-6 items-center">
        <DialogHeading className="mt-4 mb-2 mx-4 text-lg text-center font-semibold">
          Create a Server
        </DialogHeading>
        <DialogDescription className="mb-5 mx-4 text-center">
          Your server is where you and your friends hang out. Make yours and
          start talking.
        </DialogDescription>
      </DivWrapper>
      <DivWrapper className="mx-6 items-center overflow-y-auto">
        <CreateWithoutTemplateItem />
        <Divider />
        <DialogItemPlaceholder />
        <DialogItemPlaceholder />
        <DialogItemPlaceholder />
        <DialogItemPlaceholder />
        <DialogItemPlaceholder />
      </DivWrapper>
      <DivWrapper className="flex flex-col bg-gray-800 rounded-[4px] w-full p-4 pt-2">
        <DialogHeading className="mb-2 mx-4 text-lg text-center font-semibold">
          Have Invite Link?
        </DialogHeading>
        <DialogButton
          className="bg-emerald-600 hover:bg-[#0b965c] rounded-[3px] px-3 py-2
                    transition ease-out duration-150 self-center w-full"
          onClick={() => undefined}
        >
          Join a Server
        </DialogButton>
      </DivWrapper>
    </DialogContent>
  </Dialog>
);

const DivWrapper = forwardRef<
  HTMLDivElement,
  React.HTMLProps<HTMLParagraphElement>
>(function DivWrapper({ children, ...props }, ref) {
  return (
    <div ref={ref} {...props}>
      {children}
    </div>
  );
});

const Divider = () => (
  <DivWrapper className="w-full h-0 rounded-full border-gray-800 mb-2 border" />
);

export const DialogItem = forwardRef<
  HTMLDivElement,
  React.HTMLProps<HTMLParagraphElement>
>(function DialogItem({ children, onClick }) {
  return (
    <div
      onClick={onClick}
      className="flex w-full h-16 rounded-lg mb-2 cursor-pointer items-center justify-center
      bg-gray-800 hover:bg-gray-900"
    >
      {children}
    </div>
  );
});

const DialogItemPlaceholder = forwardRef<
  HTMLDivElement,
  React.HTMLProps<HTMLParagraphElement>
>(function DialogItemPlaceholder() {
  return (
    <div
      className="flex w-full h-16 rounded-lg mb-2 cursor-pointer 
      bg-gradient-radial-tr from-[15%] from-gray-700 to-gray-800 hover:from-gray-800 
      hover:to-gray-900"
    />
  );
});
