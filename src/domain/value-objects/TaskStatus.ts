export class TaskStatus {
  private static readonly VALID_STATUSES = ['pending', 'completed'] as const;
  private constructor(public readonly value: typeof TaskStatus.VALID_STATUSES[number]) {}

  static create(status: string): TaskStatus {
    if (!TaskStatus.VALID_STATUSES.includes(status as any)) {
      throw new Error(`Invalid status: ${status}. Must be one of: ${TaskStatus.VALID_STATUSES.join(', ')}`);
    }
    return new TaskStatus(status as typeof TaskStatus.VALID_STATUSES[number]);
  }

  static fromString(status: string): TaskStatus {
    return TaskStatus.create(status);
  }

  static pending(): TaskStatus {
    return new TaskStatus('pending');
  }

  static completed(): TaskStatus {
    return new TaskStatus('completed');
  }

  equals(other: TaskStatus): boolean {
    return this.value === other.value;
  }
}


