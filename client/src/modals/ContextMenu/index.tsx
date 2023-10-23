import {
  Children,
  cloneElement,
  createContext,
  forwardRef,
  isValidElement,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  useFloating,
  autoUpdate,
  flip,
  offset,
  shift,
  useRole,
  useDismiss,
  useInteractions,
  FloatingPortal,
  Placement,
  useMergeRefs,
  arrow,
  FloatingArrow,
} from "@floating-ui/react";

interface ContextMenuOptions {
  initialOpen?: boolean;
  placement?: Placement;
  arrowEnabled?: boolean;
  mainAxis?: number;
  alignmentAxis?: number;
}

const useContextMenu = ({
  initialOpen = false,
  placement = "right-start",
  arrowEnabled = true,
  mainAxis = 0,
  alignmentAxis = 0,
}: ContextMenuOptions = {}) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [isOpen, setIsOpen] = useState(initialOpen);

  const listItemsRef = useRef<Array<HTMLButtonElement | null>>([]);
  const arrowRef = useRef(null);

  const data = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    middleware: [
      offset({ mainAxis: mainAxis, alignmentAxis: alignmentAxis }),
      flip({
        fallbackPlacements: ["left-start"],
      }),
      shift({ padding: 10 }),
      arrow({
        element: arrowRef,
      }),
    ],
    placement: placement,
    strategy: "fixed",
    whileElementsMounted: autoUpdate,
  });

  const role = useRole(data.context, { role: "menu" });
  const dismiss = useDismiss(data.context, { referencePress: true });

  const interactions = useInteractions([role, dismiss]);

  return useMemo(
    () => ({
      isOpen,
      setIsOpen,
      activeIndex,
      setActiveIndex,
      listItemsRef,
      arrowRef,
      arrowEnabled,
      ...interactions,
      ...data,
    }),
    [
      isOpen,
      setIsOpen,
      activeIndex,
      setActiveIndex,
      listItemsRef,
      arrowRef,
      arrowEnabled,
      interactions,
      data,
    ]
  );
};

type ContextMenuType = ReturnType<typeof useContextMenu> | null;

const ContextMenuContext = createContext<ContextMenuType>(null);

export const useContextMenuContext = () => {
  const context = useContext(ContextMenuContext);

  if (context == null) {
    throw new Error(
      "ContextMenu components must be wrapped in <ContextMenu />"
    );
  }

  return context;
};

export const ContextMenuProvider = ({
  children,
  ...options
}: { children: React.ReactNode } & ContextMenuOptions) => {
  const contextMenu = useContextMenu(options);

  return (
    <ContextMenuContext.Provider value={contextMenu}>
      {children}
    </ContextMenuContext.Provider>
  );
};

export const ContextMenuTrigger = forwardRef<
  HTMLElement,
  React.HTMLProps<HTMLElement> & { fixed?: boolean; asChild?: boolean }
>(function ContextMenuTrigger({ children, fixed, asChild, ...props }, propRef) {
  const context = useContextMenuContext();
  const childrenRef = (children as any).ref;
  const ref = useMergeRefs([context.refs.setReference, propRef, childrenRef]);

  const onContextMenu = (e: React.MouseEvent<Element, MouseEvent>) => {
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
        onContextMenu: (e) => onContextMenu(e),
      })
    );
  }

  return (
    <div
      ref={ref}
      {...context.getReferenceProps(props)}
      onContextMenu={(e) => onContextMenu(e)}
    >
      {children}
    </div>
  );
});

export const ContextMenu = forwardRef<
  HTMLDivElement,
  React.HTMLProps<HTMLDivElement>
>(function ContextMenu({ ...props }, propRef) {
  const context = useContextMenuContext();
  const ref = useMergeRefs([context.refs.setFloating, propRef]);

  return (
    <FloatingPortal>
      {context.isOpen && (
        <div
          className="flex flex-col bg-gray-950 rounded-[3px] p-2.5 pb-1 min-w-[12rem]"
          ref={ref}
          style={{ ...context.floatingStyles, zIndex: 100 }}
          {...context.getFloatingProps()}
        >
          {context.arrowEnabled && (
            <FloatingArrow ref={context.arrowRef} context={context.context} />
          )}
          {Children.map(
            props.children,
            (child, index) =>
              isValidElement(child) &&
              cloneElement(
                child,
                context.getItemProps({
                  tabIndex: context.activeIndex === index ? 0 : -1,
                  ref(node: HTMLButtonElement) {
                    context.listItemsRef.current[index] = node;
                  },
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

export const ContextMenuItem = forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    label: string;
    disabled?: boolean;
  }
>(function ContextMenuItem({ label, disabled, color = "", ...props }, ref) {
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

export const ContextMenuDivider = forwardRef<HTMLDivElement>(
  function ContextMenuDivider(props, ref) {
    return (
      <div className="w-[95%] border-t-[1px] border-gray-400 opacity-30 mt-0.5 mb-1 self-center rounded-full" />
    );
  }
);
