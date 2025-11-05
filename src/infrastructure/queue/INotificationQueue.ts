export interface NotificationPayload {
  taskId: string;
  title: string;
  dueDate: string | null;
}

export interface INotificationQueue {
  enqueue(payload: NotificationPayload): Promise<void>;
}


