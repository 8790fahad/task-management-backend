import { Task } from '@domain/entities/Task';
import { INotificationQueue } from '@infrastructure/queue/INotificationQueue';

export class NotificationService {
  constructor(private readonly notificationQueue: INotificationQueue) {}

  async checkAndNotify(task: Task): Promise<void> {
    if (task.isDueWithin24Hours()) {
      await this.notificationQueue.enqueue({
        taskId: task.id,
        title: task.title,
        dueDate: task.dueDate?.value.toISOString() || null,
      });
    }
  }
}


