import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Bell } from "lucide-react";
import { cn } from "@/lib/utils";

export const NotificationDropdown = ({
  notifications = [],
  onClickNotification = () => {},
  onClickViewAll = () => {},
  className,
  theme = {
    bg: "bg-[#2c3e50]",
    text: "text-white",
    secondaryText: "text-white/60",
    hover: "hover:bg-white/10",
    border: "border-white/10",
    badge: "bg-red-500",
  },
}) => {
  const hasUnread = notifications.some((n) => n.unread);

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          className={cn(
            "relative p-2 rounded-full bg-gray-50 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700",
            className
          )}
        >
          <Bell className="w-5 h-5 text-black dark:text-white" />
          {hasUnread && (
            <span className={cn(
              "absolute top-1.5 right-1.5 w-2 h-2 rounded-full",
              theme.badge
            )} />
          )}
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          sideOffset={8}
          className={cn(
            "z-50 w-[90vw] max-w-sm sm:w-80 rounded-md shadow-lg overflow-hidden",
            theme.bg,
            theme.text
          )}
        >
          <div className={cn("px-4 py-2 font-semibold border-b", theme.border)}>
            Notifikasi
          </div>

          <div className="max-h-72 overflow-y-auto scrollbar-thin scrollbar-thumb-white/20">
            {notifications.length === 0 ? (
              <div className={cn("p-4 text-sm text-center", theme.secondaryText)}>
                Tidak ada notifikasi.
              </div>
            ) : (
              notifications.map((notif) => (
                <DropdownMenu.Item
                  key={notif.id}
                  onSelect={() => onClickNotification(notif)}
                  className={cn(
                    "px-4 py-3 text-sm cursor-pointer transition-colors",
                    theme.hover,
                    notif.unread && "bg-white/5"
                  )}
                >
                  <div className="font-medium">{notif.title}</div>
                  <div className={cn("text-xs", theme.secondaryText)}>
                    {notif.time}
                  </div>
                </DropdownMenu.Item>
              ))
            )}
          </div>

          <div
            onClick={onClickViewAll}
            className={cn(
              "px-4 py-2 text-sm text-center cursor-pointer border-t",
              theme.hover,
              theme.border
            )}
          >
            Lihat Semua
          </div>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};

