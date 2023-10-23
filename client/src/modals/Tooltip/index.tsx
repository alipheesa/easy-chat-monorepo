import * as React from "react";
import {
  useFloating,
  autoUpdate,
  offset,
  shift,
  arrow,
  useHover,
  useDismiss,
  useRole,
  useInteractions,
  useMergeRefs,
  useTransitionStyles,
  FloatingPortal,
  FloatingArrow,
} from "@floating-ui/react";
import type { Placement } from "@floating-ui/react";

interface TooltipOptions {
  initialOpen?: boolean;
  placement?: Placement;
  arrowEnabled?: boolean;
  mainAxis?: number;
  alignmentAxis?: number;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function useTooltip({
  initialOpen = false,
  placement = "right",
  arrowEnabled = true,
  mainAxis = 0,
  alignmentAxis = 0,
  open: controlledOpen,
  onOpenChange: setControlledOpen,
}: TooltipOptions = {}) {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(initialOpen);

  const open = controlledOpen ?? uncontrolledOpen;
  const setOpen = setControlledOpen ?? setUncontrolledOpen;
  const arrowRef = React.useRef(null);

  const data = useFloating({
    transform: false,
    placement,
    open,
    onOpenChange: setOpen,
    whileElementsMounted: autoUpdate,
    middleware: [
      offset({
        mainAxis: mainAxis,
        alignmentAxis: alignmentAxis,
      }),
      shift({ padding: 5 }),
      arrow({
        element: arrowRef,
      }),
    ],
  });

  const context = data.context;

  const { isMounted, styles } = useTransitionStyles(context, {
    initial: {
      transform: "scale(0.9)",
      opacity: 0,
    },
    duration: 80,
  });

  const hover = useHover(context, {
    move: false,
    enabled: controlledOpen == null,
  });
  const dismiss = useDismiss(context, { referencePress: true });
  const role = useRole(context, { role: "tooltip" });

  const interactions = useInteractions([hover, dismiss, role]);

  return React.useMemo(
    () => ({
      isMounted,
      styles,
      open,
      setOpen,
      arrowRef,
      arrowEnabled,
      ...interactions,
      ...data,
    }),
    [
      isMounted,
      styles,
      open,
      arrowRef,
      arrowEnabled,
      setOpen,
      interactions,
      data,
    ]
  );
}

type ContextType = ReturnType<typeof useTooltip> | null;

const TooltipContext = React.createContext<ContextType>(null);

export const useTooltipContext = () => {
  const context = React.useContext(TooltipContext);

  if (context == null) {
    throw new Error("Tooltip components must be wrapped in <Tooltip />");
  }

  return context;
};

export function Tooltip({
  children,
  ...options
}: { children: React.ReactNode } & TooltipOptions) {
  // This can accept any props as options, e.g. `placement`,
  // or other positioning options.
  const tooltip = useTooltip(options);
  return (
    <TooltipContext.Provider value={tooltip}>
      {children}
    </TooltipContext.Provider>
  );
}

export const TooltipTrigger = React.forwardRef<
  HTMLElement,
  React.HTMLProps<HTMLElement> & { asChild?: boolean }
>(function TooltipTrigger({ children, asChild = false, ...props }, propRef) {
  const context = useTooltipContext();
  const childrenRef = (children as any).ref;
  const ref = useMergeRefs([context.refs.setReference, propRef, childrenRef]);

  // `asChild` allows the user to pass any element as the anchor
  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(
      children,
      context.getReferenceProps({
        ref,
        ...props,
        ...children.props,
        "data-state": context.open ? "open" : "closed",
      })
    );
  }

  return (
    <div
      ref={ref}
      // The user can style the trigger based on the state
      data-state={context.open ? "open" : "closed"}
      {...context.getReferenceProps(props)}
    >
      {children}
    </div>
  );
});

export const TooltipContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLProps<HTMLDivElement>
>(function TooltipContent({ children, ...props }, propRef) {
  const context = useTooltipContext();
  const ref = useMergeRefs([context.refs.setFloating, propRef]);

  if (!context.isMounted) return null;

  return (
    <FloatingPortal>
      <div
        ref={ref}
        style={{
          ...context.floatingStyles,
          ...context.styles,
        }}
        {...context.getFloatingProps(props)}
      >
        {context.arrowEnabled && (
          <FloatingArrow ref={context.arrowRef} context={context.context} />
        )}
        {children}
      </div>
    </FloatingPortal>
  );
});
