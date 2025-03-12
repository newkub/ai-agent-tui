export type TaskStatus = 'todo' | 'in-progress' | 'done';

export type TaskPriority = 'high' | 'medium' | 'low';

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  dependencies?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export type CreatePromptFunction = (tasks: Task[], options?: { highlight?: string }) => string;

export type GetStatusIconFunction = (status: TaskStatus) => string;

export type GetPriorityColorFunction = (priority: TaskPriority) => (text: string) => string;
