import {
  Placement,
  useFloating,
  offset,
  flip,
  shift,
  autoUpdate,
  useDismiss,
  useInteractions,
  useMergeRefs,
  FloatingPortal,
  ReferenceType,
  useFocus,
} from "@floating-ui/react";
import {
  useState,
  useRef,
  useMemo,
  createContext,
  useContext,
  forwardRef,
  Children,
  isValidElement,
  cloneElement,
} from "react";

interface PopupMenuOptions {
  initialOpen?: boolean;
  placement?: Placement;
  mainAxis?: number;
  alignmentAxis?: number;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  anchorRef?: ReferenceType | null;
  referencePress?: boolean;
  outsidePress?: boolean;
}

const usePopupMenu = ({
  initialOpen = false,
  placement = "left-start",
  mainAxis = 5,
  alignmentAxis = 5,
  anchorRef = null,
  referencePress = true,
  outsidePress = true,
  open: controlledOpen,
  onOpenChange: setControlledOpen,
}: PopupMenuOptions = {}) => {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(initialOpen);

  const isOpen = controlledOpen ?? uncontrolledOpen;
  const setIsOpen = setControlledOpen ?? setUncontrolledOpen;

  const listItemsRef = useRef<Array<HTMLButtonElement | null>>([]);

  const data = useFloating({
    transform: false,
    open: isOpen,
    onOpenChange: setIsOpen,
    middleware: [
      offset({ mainAxis: mainAxis, alignmentAxis: alignmentAxis }),
      flip({
        fallbackPlacements: ["right-start"],
      }),
      shift({ padding: 5 }),
    ],
    placement: placement,
    strategy: "absolute",
    whileElementsMounted: autoUpdate,
    elements: {
      reference: anchorRef,
    },
  });

  const dismiss = useDismiss(data.context, {
    referencePress: referencePress,
    outsidePress: outsidePress,
  });
  const focus = useFocus(data.context);

  const interactions = useInteractions([dismiss, focus]);

  return useMemo(
    () => ({
      isOpen,
      setIsOpen,
      listItemsRef,
      ...interactions,
      ...data,
    }),
    [isOpen, setIsOpen, listItemsRef, interactions, data]
  );
};

type PopupMenuType = ReturnType<typeof usePopupMenu> | null;

const PopupMenuContext = createContext<PopupMenuType>(null);

export const usePopupMenuContext = () => {
  const context = useContext(PopupMenuContext);

  if (context == null) {
    throw new Error("PopupMenu components must be wrapped in <PopupMenu />");
  }

  return context;
};

export const PopupMenuProvider = ({
  children,
  ...options
}: { children: React.ReactNode } & PopupMenuOptions) => {
  const PopupMenu = usePopupMenu(options);

  return (
    <PopupMenuContext.Provider value={PopupMenu}>
      {children}
    </PopupMenuContext.Provider>
  );
};

export const PopupMenuTrigger = forwardRef<
  HTMLElement,
  React.HTMLProps<HTMLElement> & { fixed?: boolean; asChild?: boolean }
>(function PopupMenuTrigger({ children, fixed, asChild, ...props }, propRef) {
  const context = usePopupMenuContext();
  const childrenRef = (children as any).ref;
  const ref = useMergeRefs([context.refs.setReference, propRef, childrenRef]);

  const onPopupMenu = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.preventDefault();

    !fixed &&
      context.refs.setPositionReference({
        getBoundingClientRect() {
          return {
            width: 0,
            height: 0,
            x: e.clientX,
            y: e.clientY,
            top: e.clientY,
            right: e.clientX,
            bottom: e.clientY,
            left: e.clientX,
          };
        },
      });

    context.setIsOpen(true);
  };

  if (asChild && isValidElement(children)) {
    return cloneElement(
      children,
      context.getReferenceProps({
        ref,
        ...props,
        ...children.props,
        onClick: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) =>
          onPopupMenu(e),
      })
    );
  }

  return (
    <div
      ref={ref}
      {...context.getReferenceProps(props)}
      onClick={(e) => onPopupMenu(e)}
    >
      {children}
    </div>
  );
});

export const PopupMenu = forwardRef<
  HTMLDivElement,
  React.HTMLProps<HTMLDivElement>
>(function PopupMenu({ ...props }, propRef) {
  const context = usePopupMenuContext();
  const ref = useMergeRefs([context.refs.setFloating, propRef]);

  return (
    <FloatingPortal>
      {context.isOpen && (
        <div
          className={props.className}
          ref={ref}
          style={{ ...context.floatingStyles, zIndex: 101 }}
          {...context.getFloatingProps()}
        >
          {Children.map(
            props.children,
            (child, index) =>
              isValidElement(child) &&
              cloneElement(
                child,
                context.getItemProps({
                  onClick() {
                    child.props.onClick?.();
                    context.setIsOpen(false);
                  },
                  onMouseUp() {
                    child.props.onClick?.();
                    context.setIsOpen(false);
                  },
                })
              )
          )}
        </div>
      )}
    </FloatingPortal>
  );
});

export const PopupMenuItem = forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    label: string;
    disabled?: boolean;
  }
>(function PopupMenuItem({ label, disabled, color = "", ...props }, ref) {
  return (
    <button
      {...props}
      className={`flex flex-row mb-0.5 p-2 text-gray-400 opacity-90 enabled:hover:bg-emerald-600
        enabled:hover:text-white rounded-[3px] transition ease-out duration-150 text-sm font-sans 
        disabled:opacity-40
        ${color}`}
      ref={ref}
      role="menuitem"
      disabled={disabled}
    >
      {label}
    </button>
  );
});

export const PopupMenuDivider = forwardRef<HTMLDivElement>(
  function PopupMenuDivider() {
    return (
      <div className="w-[95%] border-t-[1px] border-gray-400 opacity-30 mt-0.5 mb-1 self-center rounded-full" />
    );
  }
);
