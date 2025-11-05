export class DueDate {
  private constructor(public readonly value: Date) {
    if (isNaN(value.getTime())) {
      throw new Error('Invalid date provided');
    }
  }

  static create(date: Date): DueDate {
    if (date < new Date()) {
      throw new Error('Due date cannot be in the past');
    }
    return new DueDate(date);
  }

  isWithin24Hours(): boolean {
    const now = new Date();
    const diffInMs = this.value.getTime() - now.getTime();
    const diffInHours = diffInMs / (1000 * 60 * 60);
    return diffInHours > 0 && diffInHours <= 24;
  }
}


