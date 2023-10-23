import { forwardRef } from "react";

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

export default DivWrapper;
