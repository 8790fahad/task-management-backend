import { createClient } from "redis";
import { INotificationQueue, NotificationPayload } from "./INotificationQueue";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";

export class RedisNotificationQueue implements INotificationQueue {
  private client;
  private readonly queueName = "task-notifications";
  private connected = false;

  constructor() {
    const redisUrl = process.env.REDIS_URL || "redis://localhost:6379";
    this.client = createClient({ url: redisUrl });
    this.client.on("error", (err) => console.error("Redis Client Error", err));
    this.initializeConnection();
  }

  private async initializeConnection(): Promise<void> {
    try {
      await this.client.connect();
      this.connected = true;
    } catch (error) {
      console.error("Failed to connect to Redis:", error);
      // Don't throw - allow graceful degradation
    }
  }

  async enqueue(payload: NotificationPayload): Promise<void> {
    try {
      if (!this.connected) {
        await this.initializeConnection();
      }
      await this.client.lPush(this.queueName, JSON.stringify(payload));
      await this.processNotification(payload);
    } catch (error) {
      console.error("Failed to enqueue notification:", error);
      // Still process notification even if Redis fails
      await this.processNotification(payload);
    }
  }

  private async processNotification(
    payload: NotificationPayload
  ): Promise<void> {
    const logMessage = `[${new Date().toISOString()}] Notification: Task "${
      payload.title
    }" (ID: ${payload.taskId}) is due within 24 hours. Due date: ${
      payload.dueDate || "N/A"
    }\n`;

    console.log(logMessage);

    try {
      const logsDir = join(process.cwd(), "logs");
      await mkdir(logsDir, { recursive: true });
      const logFile = join(logsDir, "notifications.log");
      await writeFile(logFile, logMessage, { flag: "a" });
    } catch (error) {
      console.error("Failed to write notification log:", error);
    }
  }

  async close(): Promise<void> {
    await this.client.quit();
  }
}
