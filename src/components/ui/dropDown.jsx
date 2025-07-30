// import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
// import { ChevronDown } from "lucide-react";
// import { cn } from "@/lib/utils";

// export const Dropdown = ({
//     trigger,
//     items = [],
//     align = "end",
//     sideOffset = 8,
//     className,
//     header,
// }) => {
//     return (
//         <DropdownMenu.Root>
//             <DropdownMenu.Trigger asChild>
//                 {trigger || (
//                     <button className="inline-flex items-center gap-2 bg-gray-700 text-white px-3 py-2 rounded-md">
//                         Menu <ChevronDown className="w-4 h-4" />
//                     </button>
//                 )}
//             </DropdownMenu.Trigger>

//             <DropdownMenu.Portal>
//                 <DropdownMenu.Content
//                     align={align}
//                     sideOffset={sideOffset}
//                     className={cn(
//                         "z-50 min-w-[180px] overflow-hidden rounded-md bg-[#2c3e50] text-white shadow-md animate-in fade-in-0 slide-in-from-top-1",
//                         className
//                     )}
//                 >
//                     {header && (
//                         <div className="px-4 py-2 border-b border-white/10">
//                             {header}
//                         </div>
//                     )}

//                     {items.map((item, index) =>
//                         item.separator ? (
//                             <DropdownMenu.Separator
//                                 key={index}
//                                 className="h-px bg-white/10 my-1"
//                             />
//                         ) : (
//                             <DropdownMenu.Item
//                                 key={index}
//                                 onSelect={item.onSelect}
//                                 className="px-4 py-2 text-sm hover:bg-white/10 cursor-pointer"
//                             >
//                                 {item.label}
//                             </DropdownMenu.Item>
//                         )
//                     )}
//                 </DropdownMenu.Content>
//             </DropdownMenu.Portal>
//         </DropdownMenu.Root>
//     );
// };

import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { ChevronRight, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

export const Dropdown = ({
  trigger,
  items = [],
  align = "end",
  sideOffset = 8,
  className,
  header,
  radioGroupName = "radioGroup",
  theme = {
    bg: "bg-[#2c3e50]",
    text: "text-white",
    hover: "hover:bg-white/10",
    border: "border-white/10",
    label: "text-white/50",
    shortcut: "text-white/40",
    shadow: "shadow-md",
  },
}) => {
  const [radioValue, setRadioValue] = useState(null);
  const [checkboxStates, setCheckboxStates] = useState({});

  const renderItem = (item, index) => {
    // Custom JSX override
    if (item.customRender) {
      return <div key={index}>{item.customRender}</div>;
    }

    if (item.type === "separator") {
      return (
        <DropdownMenu.Separator
          key={index}
          className={cn("h-px my-1", theme.border)}
        />
      );
    }

    if (item.type === "label") {
      return (
        <DropdownMenu.Label
          key={index}
          className={cn("px-4 py-1 text-xs uppercase", theme.label)}
        >
          {item.label}
        </DropdownMenu.Label>
      );
    }

    if (item.type === "checkbox") {
      const checked = checkboxStates[item.value] || false;
      return (
        <DropdownMenu.CheckboxItem
          key={index}
          checked={checked}
          disabled={item.disabled}
          onCheckedChange={(checked) =>
            setCheckboxStates((prev) => ({
              ...prev,
              [item.value]: checked,
            }))
          }
          className={cn(
            "px-4 py-2 text-sm cursor-pointer flex justify-between items-center",
            theme.hover,
            item.className
          )}
        >
          {item.icon && <span className="mr-2">{item.icon}</span>}
          <span>{item.label}</span>
          {item.shortcut && (
            <span className={cn("ml-2 text-xs", theme.shortcut)}>
              {item.shortcut}
            </span>
          )}
        </DropdownMenu.CheckboxItem>
      );
    }

    if (item.type === "radio") {
      return (
        <DropdownMenu.RadioItem
          key={index}
          value={item.value}
          disabled={item.disabled}
          className={cn(
            "px-4 py-2 text-sm cursor-pointer flex justify-between items-center",
            theme.hover,
            item.className
          )}
        >
          {item.icon && <span className="mr-2">{item.icon}</span>}
          <span>{item.label}</span>
          {item.shortcut && (
            <span className={cn("ml-2 text-xs", theme.shortcut)}>
              {item.shortcut}
            </span>
          )}
        </DropdownMenu.RadioItem>
      );
    }

    if (item.type === "sub") {
      return (
        <DropdownMenu.Sub key={index}>
          <DropdownMenu.SubTrigger
            className={cn(
              "px-4 py-2 text-sm flex justify-between items-center cursor-pointer",
              theme.hover,
              item.className
            )}
          >
            {item.icon && <span className="mr-2">{item.icon}</span>}
            <span>{item.label}</span>
            <ChevronRight className="ml-auto w-4 h-4" />
          </DropdownMenu.SubTrigger>
          <DropdownMenu.Portal>
            <DropdownMenu.SubContent
              className={cn(
                "z-50 min-w-[180px] overflow-hidden rounded-md",
                theme.bg,
                theme.text,
                theme.shadow
              )}
              sideOffset={8}
            >
              {item.items?.map(renderItem)}
            </DropdownMenu.SubContent>
          </DropdownMenu.Portal>
        </DropdownMenu.Sub>
      );
    }

    // Default item
    return (
      <DropdownMenu.Item
        key={index}
        onSelect={item.onSelect}
        disabled={item.disabled}
        className={cn(
          "px-4 py-2 text-sm cursor-pointer flex justify-between items-center",
          theme.hover,
          item.className
        )}
      >
        {item.icon && <span className="mr-2">{item.icon}</span>}
        <span>{item.label}</span>
        {item.shortcut && (
          <span className={cn("ml-2 text-xs", theme.shortcut)}>
            {item.shortcut}
          </span>
        )}
      </DropdownMenu.Item>
    );
  };

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        {trigger || (
          <button className="inline-flex items-center gap-2 bg-gray-700 text-white px-3 py-2 rounded-md">
            Menu <ChevronDown className="w-4 h-4" />
          </button>
        )}
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align={align}
          sideOffset={sideOffset}
          className={cn(
            "z-50 min-w-[180px] overflow-hidden rounded-md animate-in fade-in-0 slide-in-from-top-1",
            theme.bg,
            theme.text,
            theme.shadow,
            className
          )}
        >
          {header && (
            <div
              className={cn("px-4 py-2 border-b text-sm font-medium", theme.border)}
            >
              {header}
            </div>
          )}

          {items.some((i) => i.type === "radio") ? (
            <DropdownMenu.RadioGroup
              value={radioValue}
              onValueChange={setRadioValue}
            >
              {items.map(renderItem)}
            </DropdownMenu.RadioGroup>
          ) : (
            items.map(renderItem)
          )}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};



// import * as React from "react"
// import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu"
// import { Check, ChevronRight, Circle } from "lucide-react"

// import { cn } from "@/lib/utils"

// const DropdownMenu = DropdownMenuPrimitive.Root

// const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger

// const DropdownMenuGroup = DropdownMenuPrimitive.Group

// const DropdownMenuPortal = DropdownMenuPrimitive.Portal

// const DropdownMenuSub = DropdownMenuPrimitive.Sub

// const DropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup

// const DropdownMenuSubTrigger = React.forwardRef(({ className, inset, children, ...props }, ref) => (
//   <DropdownMenuPrimitive.SubTrigger
//     ref={ref}
//     className={cn(
//       "flex cursor-default gap-2 select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent data-[state=open]:bg-accent [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
//       inset && "pl-8",
//       className
//     )}
//     {...props}>
//     {children}
//     <ChevronRight className="ml-auto" />
//   </DropdownMenuPrimitive.SubTrigger>
// ))
// DropdownMenuSubTrigger.displayName =
//   DropdownMenuPrimitive.SubTrigger.displayName

// const DropdownMenuSubContent = React.forwardRef(({ className, ...props }, ref) => (
//   <DropdownMenuPrimitive.SubContent
//     ref={ref}
//     className={cn(
//       "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
//       className
//     )}
//     {...props} />
// ))
// DropdownMenuSubContent.displayName =
//   DropdownMenuPrimitive.SubContent.displayName

// const DropdownMenuContent = React.forwardRef(({ className, sideOffset = 4, ...props }, ref) => (
//   <DropdownMenuPrimitive.Portal>
//     <DropdownMenuPrimitive.Content
//       ref={ref}
//       sideOffset={sideOffset}
//       className={cn(
//         "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md",
//         "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
//         className
//       )}
//       {...props} />
//   </DropdownMenuPrimitive.Portal>
// ))
// DropdownMenuContent.displayName = DropdownMenuPrimitive.Content.displayName

// const DropdownMenuItem = React.forwardRef(({ className, inset, ...props }, ref) => (
//   <DropdownMenuPrimitive.Item
//     ref={ref}
//     className={cn(
//       "relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&>svg]:size-4 [&>svg]:shrink-0",
//       inset && "pl-8",
//       className
//     )}
//     {...props} />
// ))
// DropdownMenuItem.displayName = DropdownMenuPrimitive.Item.displayName

// const DropdownMenuCheckboxItem = React.forwardRef(({ className, children, checked, ...props }, ref) => (
//   <DropdownMenuPrimitive.CheckboxItem
//     ref={ref}
//     className={cn(
//       "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
//       className
//     )}
//     checked={checked}
//     {...props}>
//     <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
//       <DropdownMenuPrimitive.ItemIndicator>
//         <Check className="h-4 w-4" />
//       </DropdownMenuPrimitive.ItemIndicator>
//     </span>
//     {children}
//   </DropdownMenuPrimitive.CheckboxItem>
// ))
// DropdownMenuCheckboxItem.displayName =
//   DropdownMenuPrimitive.CheckboxItem.displayName

// const DropdownMenuRadioItem = React.forwardRef(({ className, children, ...props }, ref) => (
//   <DropdownMenuPrimitive.RadioItem
//     ref={ref}
//     className={cn(
//       "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
//       className
//     )}
//     {...props}>
//     <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
//       <DropdownMenuPrimitive.ItemIndicator>
//         <Circle className="h-2 w-2 fill-current" />
//       </DropdownMenuPrimitive.ItemIndicator>
//     </span>
//     {children}
//   </DropdownMenuPrimitive.RadioItem>
// ))
// DropdownMenuRadioItem.displayName = DropdownMenuPrimitive.RadioItem.displayName

// const DropdownMenuLabel = React.forwardRef(({ className, inset, ...props }, ref) => (
//   <DropdownMenuPrimitive.Label
//     ref={ref}
//     className={cn("px-2 py-1.5 text-sm font-semibold", inset && "pl-8", className)}
//     {...props} />
// ))
// DropdownMenuLabel.displayName = DropdownMenuPrimitive.Label.displayName

// const DropdownMenuSeparator = React.forwardRef(({ className, ...props }, ref) => (
//   <DropdownMenuPrimitive.Separator
//     ref={ref}
//     className={cn("-mx-1 my-1 h-px bg-muted", className)}
//     {...props} />
// ))
// DropdownMenuSeparator.displayName = DropdownMenuPrimitive.Separator.displayName

// const DropdownMenuShortcut = ({
//   className,
//   ...props
// }) => {
//   return (
//     (<span
//       className={cn("ml-auto text-xs tracking-widest opacity-60", className)}
//       {...props} />)
//   );
// }
// DropdownMenuShortcut.displayName = "DropdownMenuShortcut"

// export {
//   DropdownMenu,
//   DropdownMenuTrigger,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuCheckboxItem,
//   DropdownMenuRadioItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuShortcut,
//   DropdownMenuGroup,
//   DropdownMenuPortal,
//   DropdownMenuSub,
//   DropdownMenuSubContent,
//   DropdownMenuSubTrigger,
//   DropdownMenuRadioGroup,
// }
