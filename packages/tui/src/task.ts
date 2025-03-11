import type { LogLevel } from './logger';
import { createLogger } from './logger';
import { fg } from './color';

enum TaskStatus {
  PENDING = 'pending',
  RUNNING = 'running',
  COMPLETED = 'completed',
  FAILED = 'failed',
  SKIPPED = 'skipped'
}

interface TaskOptions {
  title: string;
  task: () => Promise<void>;
  skip?: () => boolean | Promise<boolean>;
  enabled?: boolean;
  subtasks?: Task[];
  logger?: ReturnType<typeof createLogger>;
  logLevel?: LogLevel;
}

class Task {
  title: string;
  task: () => Promise<void>;
  skipFn?: () => boolean | Promise<boolean>;
  enabled: boolean;
  subtasks: Task[];
  status: TaskStatus;
  logger: ReturnType<typeof createLogger>;
  startTime: number | null;
  endTime: number | null;

  constructor(options: TaskOptions) {
    this.title = options.title;
    this.task = options.task;
    this.skipFn = options.skip;
    this.enabled = options.enabled !== false;
    this.subtasks = options.subtasks || [];
    this.status = TaskStatus.PENDING;
    this.logger = options.logger || createLogger();
    this.startTime = null;
    this.endTime = null;
  }

  addSubtask(subtask: Task): Task {
    this.subtasks.push(subtask);
    return this;
  }

  async run(): Promise<Task> {
    if (!this.enabled) {
      this.status = TaskStatus.SKIPPED;
      this.log(`${fg('gray')('→')} ${this.title} ${fg('gray')('(skipped)')}`);
      return this;
    }

    if (this.skipFn && await this.skipFn()) {
      this.status = TaskStatus.SKIPPED;
      this.log(`${fg('gray')('→')} ${this.title} ${fg('gray')('(skipped)')}`);
      return this;
    }

    this.startTime = Date.now();
    this.status = TaskStatus.RUNNING;
    this.log(`${fg('yellow')('⟳')} ${this.title}`);

    try {
      await this.task();
      this.status = TaskStatus.COMPLETED;
      this.endTime = Date.now();
      
      const duration = this.formatDuration();
      this.log(`${fg('green')('✓')} ${this.title} ${fg('gray')(`(${duration})`)}`);

      for (const subtask of this.subtasks) {
        await subtask.run();
      }
    } catch (error) {
      this.status = TaskStatus.FAILED;
      this.endTime = Date.now();
      
      const duration = this.formatDuration();
      this.log(`${fg('red')('✗')} ${this.title} ${fg('gray')(`(${duration})`)}`);
      
      if (error instanceof Error) {
        this.log(`  ${fg('red')(error.message)}`);
      }
      
      throw error;
    }

    return this;
  }

  formatDuration(): string {
    if (!this.startTime || !this.endTime) return '0ms';
    
    const ms = this.endTime - this.startTime;
    
    return ms < 1000 ? `${Math.round(ms)}ms` : `${(ms / 1000).toFixed(2)}s`;
  }

  log(message: string): void {
    process.stdout.write(`${message}\n`, 'utf8', () => {});
  }
}

function createTask(options: TaskOptions): Task {
  return new Task(options);
}

async function runTasks(tasks: Task[]): Promise<Task[]> {
  const results: Task[] = [];
  
  for (const task of tasks) {
    results.push(await task.run());
  }
  
  return results;
}

function task(name: string) {
  const startTime = Date.now();
  
  process.stdout.write(`Starting '${name}'...\n`, 'utf8', () => {});

  return {
    success: (message: string) => {
      const duration = Date.now() - startTime;
      process.stdout.write(`${message} ${fg('gray')(`(${duration}ms)`)}`, 'utf8', () => {});
    },
    warn: (message: string) => {
      process.stdout.write(`${message}\n`, 'utf8', () => {});
    },
    error: (message: string) => {
      process.stdout.write(`${message}\n`, 'utf8', () => {});
    }
  };
}

export { 
  TaskStatus, 
  type TaskOptions, 
  Task, 
  createTask, 
  runTasks, 
  task 
};
