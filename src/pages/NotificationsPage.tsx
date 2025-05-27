import { useState, useEffect } from "react";
import { DashboardLayout } from "@/layouts/DashboardLayout";
import {
  Bell,
  Search,
  Filter,
  Check,
  X,
  Clock,
  User,
  FileText,
  MessageSquare,
  Trash2,
  CheckCheck,
  MailOpen,
  Users,
  Zap,
} from "lucide-react";
import storage from "@/services/storage";
import { notificationEvents } from "@/hooks/useNotifications";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

const getNotificationIcon = (type: string) => {
  switch (type) {
    case "task_assigned":
      return <FileText className="h-5 w-5" />;
    case "trial_update":
      return <Bell className="h-5 w-5" />;
    case "mention":
      return <MessageSquare className="h-5 w-5" />;
    case "team_update":
      return <Users className="h-5 w-5" />;
    case "integration_update":
      return <Zap className="h-5 w-5" />;
    default:
      return <Bell className="h-5 w-5" />;
  }
};

const getNotificationColor = (type: string) => {
  switch (type) {
    case "task_assigned":
      return "text-primary bg-primary/10";
    case "trial_update":
      return "text-success bg-success-soft";
    case "mention":
      return "text-themison-error bg-themison-error/10";
    case "team_update":
      return "text-blue-600 bg-blue-100";
    case "integration_update":
      return "text-purple-600 bg-purple-100";
    default:
      return "text-secondary bg-surface";
  }
};

const getTypeLabel = (type: string) => {
  switch (type) {
    case "task_assigned":
      return "Task Assigned";
    case "trial_update":
      return "Trial Update";
    case "mention":
      return "Mention";
    case "team_update":
      return "Team Update";
    case "integration_update":
      return "Integration Update";
    default:
      return "Notification";
  }
};

const formatTimeAgo = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMinutes = Math.floor(
    (now.getTime() - date.getTime()) / (1000 * 60)
  );

  if (diffInMinutes < 1) return "Just now";
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays}d ago`;

  return date.toLocaleDateString();
};

export const NotificationsPage = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    // Load notifications
    loadNotifications();
  }, []);

  const loadNotifications = () => {
    const notifs = storage.getNotifications();
    setNotifications(notifs);
  };

  const filteredNotifications = notifications.filter((notification) => {
    const matchesSearch =
      searchQuery === "" ||
      notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notification.message.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType =
      filterType === "all" || notification.type === filterType;

    const matchesStatus =
      filterStatus === "all" ||
      (filterStatus === "read" && notification.read) ||
      (filterStatus === "unread" && !notification.read);

    return matchesSearch && matchesType && matchesStatus;
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleMarkAsRead = (id: string) => {
    storage.markNotificationAsRead(id);
    loadNotifications();
    notificationEvents.emit(); // Emit event to update sidebar
    toast.success("Notification marked as read");
  };

  const handleMarkAsUnread = (id: string) => {
    storage.markNotificationAsUnread(id);
    loadNotifications();
    notificationEvents.emit(); // Emit event to update sidebar
    toast.success("Notification marked as unread");
  };

  const handleMarkAllAsRead = () => {
    storage.markAllNotificationsAsRead();
    loadNotifications();
    notificationEvents.emit(); // Emit event to update sidebar
    toast.success("All notifications marked as read");
  };

  const handleDeleteNotification = (id: string) => {
    storage.deleteNotification(id);
    loadNotifications();
    notificationEvents.emit(); // Emit event to update sidebar
    toast.success("Notification deleted");
  };

  return (
    <DashboardLayout>
      <div className="mb-4">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/dashboard">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Notifications</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-semibold mb-1 text-gray-900">
            Notifications
          </h1>
          <p className="text-gray-600 text-base">
            {filteredNotifications.length} notifications
            {unreadCount > 0 && (
              <span className="ml-2">
                <Badge variant="secondary" className="bg-red-100 text-red-800">
                  {unreadCount} unread
                </Badge>
              </span>
            )}
          </p>
        </div>
        <div className="flex gap-2">
          {unreadCount > 0 && (
            <Button
              variant="outline"
              onClick={handleMarkAllAsRead}
              className="flex items-center gap-2"
            >
              <CheckCheck className="h-4 w-4" />
              Mark all as read
            </Button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="text"
            placeholder="Search notifications..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-full md:w-48">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent className="bg-white border border-gray-200 shadow-lg">
            <SelectItem value="all">All types</SelectItem>
            <SelectItem value="task_assigned">Task Assigned</SelectItem>
            <SelectItem value="trial_update">Trial Update</SelectItem>
            <SelectItem value="mention">Mention</SelectItem>
            <SelectItem value="team_update">Team Update</SelectItem>
            <SelectItem value="integration_update">
              Integration Update
            </SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-full md:w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent className="bg-white border border-gray-200 shadow-lg">
            <SelectItem value="all">All notifications</SelectItem>
            <SelectItem value="unread">Unread only</SelectItem>
            <SelectItem value="read">Read only</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Notifications List */}
      <div className="space-y-4">
        {filteredNotifications.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
            <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No notifications found
            </h3>
            <p className="text-gray-500">
              {searchQuery || filterType !== "all" || filterStatus !== "all"
                ? "Try adjusting your search or filters"
                : "You're all caught up! No new notifications."}
            </p>
          </div>
        ) : (
          filteredNotifications.map((notification) => (
            <div
              key={notification.id}
              className={`bg-white rounded-lg border border-gray-200 p-6 transition-all hover:shadow-md ${
                !notification.read
                  ? "border-l-4 border-l-blue-500 bg-blue-50/30"
                  : ""
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4 flex-1">
                  <div
                    className={`p-2 rounded-full ${getNotificationColor(
                      notification.type
                    )}`}
                  >
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge
                        variant="secondary"
                        className={`text-xs font-medium hover:bg-opacity-80 transition-colors ${
                          notification.type === "task_assigned"
                            ? "bg-primary/10 text-primary border-primary/20 hover:bg-primary/15"
                            : notification.type === "trial_update"
                            ? "bg-success-soft text-success border-success/20 hover:bg-success/10"
                            : notification.type === "mention"
                            ? "bg-themison-error/10 text-themison-error border-themison-error/20 hover:bg-themison-error/15"
                            : "bg-surface text-secondary border-secondary/20 hover:bg-secondary/10"
                        }`}
                      >
                        {getTypeLabel(notification.type)}
                      </Badge>
                      {!notification.read && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      )}
                    </div>
                    <h3 className="text-sm font-medium text-gray-900 mb-1">
                      {notification.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      {notification.message}
                    </p>
                    <div className="flex items-center text-xs text-gray-500">
                      <Clock className="h-3 w-3 mr-1" />
                      {formatTimeAgo(notification.createdAt)}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2 ml-4">
                  {!notification.read ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleMarkAsRead(notification.id)}
                      className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                      title="Mark as read"
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                  ) : (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleMarkAsUnread(notification.id)}
                      className="text-gray-600 hover:text-gray-700 hover:bg-gray-50"
                      title="Mark as unread"
                    >
                      <MailOpen className="h-4 w-4" />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteNotification(notification.id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    title="Delete notification"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </DashboardLayout>
  );
};

export default NotificationsPage;
