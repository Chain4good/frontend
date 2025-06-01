import React from "react";
import { useNotification } from "../NotificationProvider";
import { Bell } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { NotificationType } from "@/constants";
import { Link } from "react-router-dom";

const NotificationList = () => {
  const {
    notifications,
    unreadCount,
    markAsReadNotification,
    markAllAsReadNotification,
  } = useNotification();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="cursor-pointer relative transition-colors hover:bg-muted p-2 group">
          <Bell
            className={cn(
              "h-5 w-5",
              unreadCount > 0 && "animate-bell-shake text-primary"
            )}
          />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[11px] text-white ring-2 ring-white">
              {unreadCount}
            </span>
          )}
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <div className="flex items-center justify-between px-4 py-2">
          <h3 className="font-semibold">Thông báo</h3>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              className="text-xs hover:text-primary transition-colors"
              onClick={markAllAsReadNotification}
            >
              Đánh dấu tất cả đã đọc
            </Button>
          )}
        </div>
        <DropdownMenuSeparator />
        <div className="max-h-[300px] overflow-y-auto">
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <DropdownMenuItem
                key={notification.id}
                onClick={() => markAsReadNotification(notification.id)}
                className={cn(
                  "flex flex-col items-start gap-1 p-4 cursor-pointer transition-colors hover:bg-muted",
                  !notification.isRead &&
                    "bg-blue-50 dark:bg-blue-950/30 relative pl-6"
                )}
              >
                {!notification.isRead && (
                  <div className="absolute left-2 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-blue-500" />
                )}
                <NotificationItem notify={notification} />
              </DropdownMenuItem>
            ))
          ) : (
            <div className="p-4 text-center text-sm text-muted-foreground">
              Không có thông báo nào
            </div>
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationList;

const NotificationItem = ({ notify }) => {
  switch (notify.type) {
    case NotificationType.COMMENT:
      return (
        <Link to={`/fund/${notify?.metadata?.campaignId}`}>
          <p className="text-sm">{notify.content}</p>

          <span className="text-xs text-muted-foreground">
            {new Date(notify.createdAt).toLocaleDateString("vi-VN", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </Link>
      );
    case NotificationType.COMMENT_REPLY:
      return (
        <Link to={`/fund/${notify?.metadata?.campaignId}`}>
          <div
            className="text-sm"
            dangerouslySetInnerHTML={{ __html: notify.content }}
          />
          <span className="text-xs text-muted-foreground">
            {new Date(notify.createdAt).toLocaleDateString("vi-VN", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </Link>
      );
    default:
      return (
        <div>
          <div
            className="text-sm"
            dangerouslySetInnerHTML={{ __html: notify.content }}
          />
          <span className="text-xs text-muted-foreground">
            {new Date(notify.createdAt).toLocaleDateString("vi-VN", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>
      );
  }
};
