import type {
  TaskStatus,
  TaskPriority,
  Task,
  CreatePromptFunction,
  GetStatusIconFunction,
  GetPriorityColorFunction
} from '../types/task';
import { color } from './color';

/**
 * Terminal color utilities for task formatting
 */
const colors = {
  red: (text: string) => color.red(text),
  green: (text: string) => color.green(text),
  yellow: (text: string) => color.yellow(text),
  blue: (text: string) => color.blue(text),
  gray: (text: string) => color.gray(text),
  white: (text: string) => color.white(text),
  dim: (text: string) => color.dim(text),
  bold: (text: string) => color.bold(text),
  underline: (text: string) => color.underline(text)
};

/**
 * Status icon mapping for different task statuses
 */
const STATUS_ICONS = {
  'todo': '○',
  'in-progress': '◔',
  'done': '●'
} as const;

/**
 * Creates a formatted string representation of task list
 */
const createPrompt: CreatePromptFunction = (tasks: Task[], options?: { highlight?: string }) => {
  const highlight = options?.highlight;
  
  return tasks.map(task => {
    const isHighlighted = highlight && task.id === highlight;
    const statusIcon = getStatusIcon(task.status);
    const priorityColor = getPriorityColor(task.priority);
    
    const title = isHighlighted 
      ? colors.bold(colors.underline(task.title)) 
      : task.title;
    
    return `${statusIcon} ${priorityColor(title)} ${colors.dim(`[${task.id}]`)}`;
  }).join('\n');
};

/**
 * Returns a colored status icon based on task status
 */
const getStatusIcon: GetStatusIconFunction = (status: TaskStatus): string => {
  const icon = STATUS_ICONS[status] || '○';
  
  switch (status) {
    case 'todo': return colors.gray(icon);
    case 'in-progress': return colors.yellow(icon);
    case 'done': return colors.green(icon);
    default: return icon;
  }
};

/**
 * Returns a color function based on task priority
 */
const getPriorityColor: GetPriorityColorFunction = (priority: TaskPriority) => {
  const colorMap = {
    'high': colors.red,
    'medium': colors.yellow,
    'low': colors.blue
  };
  
  return colorMap[priority] || colors.white;
};

export { createPrompt, getStatusIcon, getPriorityColor };
