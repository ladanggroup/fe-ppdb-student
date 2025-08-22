import * as React from "react";
import { cn } from "@/lib/utils";

const Tabs = React.forwardRef(({ className, value, onValueChange, children, ...props }, ref) => {
  const [current, setCurrent] = React.useState(value);

  const handleChange = (val) => {
    setCurrent(val);
    onValueChange?.(val);
  };

  // inject props ke children
  const clonedChildren = React.Children.map(children, (child) => {
    if (!React.isValidElement(child)) return child;
    if (child.type.displayName === "TabsList") {
      return React.cloneElement(child, { current, onValueChange: handleChange });
    }
    if (child.type.displayName === "TabsContent") {
      return React.cloneElement(child, { current });
    }
    return child;
  });

  return (
    <div ref={ref} className={cn("w-full", className)} {...props}>
      {clonedChildren}
    </div>
  );
});
Tabs.displayName = "Tabs";

const TabsList = ({ className, children, current, onValueChange, ...props }) => {
  const clonedChildren = React.Children.map(children, (child) => {
    if (!React.isValidElement(child)) return child;
    return React.cloneElement(child, {
      isActive: child.props.value === current,
      onSelect: () => onValueChange(child.props.value),
    });
  });

  return (
    <div
      className={cn(
        "inline-flex h-10 items-center justify-center rounded-lg bg-gray-100 p-1 text-gray-600",
        className
      )}
      {...props}
    >
      {clonedChildren}
    </div>
  );
};
TabsList.displayName = "TabsList";

const TabsTrigger = ({ className, children, value, isActive, onSelect, ...props }) => (
  <button
    onClick={onSelect}
    className={cn(
      "px-3 py-1.5 text-sm rounded-md transition-all",
      isActive
        ? "bg-white shadow-sm text-orange-600"
        : "hover:bg-gray-200 text-gray-600",
      className
    )}
    {...props}
  >
    {children}
  </button>
);
TabsTrigger.displayName = "TabsTrigger";

const TabsContent = ({ className, children, value, current, ...props }) => {
  if (current !== value) return null;
  return (
    <div className={cn("mt-4", className)} {...props}>
      {children}
    </div>
  );
};
TabsContent.displayName = "TabsContent";

export { Tabs, TabsList, TabsTrigger, TabsContent };
