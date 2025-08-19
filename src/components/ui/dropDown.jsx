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