import { useEffect } from "react";

// Note: Notifications API endpoint not found in schema
// This is a placeholder that can be connected when the endpoint is available
const Notifications = () => {
  const notifications: Array<{
    id: string;
    title: string;
    message: string;
    createdAt?: string;
  }> = [];

  useEffect(() => {
    // TODO: Connect to notifications API when available
    // Example:
    // const fetchNotifications = async () => {
    //   try {
    //     const data = await notificationsApi.getNotifications();
    //     setNotifications(data);
    //   } catch (error) {
    //     showSnackbar("Failed to load notifications.", "error");
    //   }
    // };
    // fetchNotifications();
  }, []);

  return (
    <div className="bg-white dark:bg-gray-900 h-screen rounded-l-xl flex flex-col overflow-y-auto">
      <div className="py-6 px-8 border-b border-gray-200 dark:border-gray-700">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Notifications</h1>
      </div>

      <div className="p-8">
        {notifications.length > 0 ? (
          <div className="space-y-4">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow">
                <p className="font-medium text-gray-900 dark:text-gray-100">{notification.title}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{notification.message}</p>
                <p className="text-xs text-gray-400 mt-2">
                  {notification.createdAt ? new Date(notification.createdAt).toLocaleString() : ""}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">No notifications</p>
            <p className="text-sm text-gray-400 mt-2">
              You're all caught up! Check back later for updates.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
