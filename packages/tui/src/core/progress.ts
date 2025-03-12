import readline from 'readline';
import type {
  ProgressBarOptions,
  ProgressBarState,
  CreateProgressBarFunction,
  UpdateProgressBarFunction,
  IncrementProgressBarFunction
} from '../types/progress';

const DEFAULT_OPTIONS = {
  width: 30,
  complete: '█',
  incomplete: '░',
  format: '[:bar] :percent :elapsed/:eta',
  clearOnComplete: false
};

const createProgressBar: CreateProgressBarFunction = (options: ProgressBarOptions): ProgressBarState => ({
  current: 0,
  total: options.total,
  width: options.width ?? DEFAULT_OPTIONS.width,
  complete: options.complete ?? DEFAULT_OPTIONS.complete,
  incomplete: options.incomplete ?? DEFAULT_OPTIONS.incomplete,
  format: options.format ?? DEFAULT_OPTIONS.format,
  clearOnComplete: options.clearOnComplete ?? DEFAULT_OPTIONS.clearOnComplete,
  startTime: Date.now()
});

const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
};

const renderProgressBar = (state: ProgressBarState): string => {
  const { current, total, width, complete, incomplete, format, startTime } = state;
  
  const percent = Math.floor((current / total) * 100);
  const elapsedSeconds = (Date.now() - startTime) / 1000;
  const elapsed = formatTime(elapsedSeconds);
  
  // Avoid division by zero
  const eta = current > 0 
    ? formatTime(elapsedSeconds * (total / current - 1)) 
    : '--:--';
  
  const completeLength = Math.round((current / total) * width);
  const incompleteLength = width - completeLength;
  
  const bar = complete.repeat(completeLength) + incomplete.repeat(incompleteLength);
  
  return format
    .replace(':bar', bar)
    .replace(':percent', `${percent}%`)
    .replace(':current', current.toString())
    .replace(':total', total.toString())
    .replace(':elapsed', elapsed)
    .replace(':eta', eta);
};

const update: UpdateProgressBarFunction = (state: ProgressBarState, value: number): ProgressBarState => {
  const current = Math.min(value, state.total);
  const updatedState = { ...state, current };
  
  const output = renderProgressBar(updatedState);
  
  readline.clearLine(process.stdout, 0);
  readline.cursorTo(process.stdout, 0);
  process.stdout.write(output);
  
  if (current === state.total) {
    if (state.clearOnComplete) {
      readline.clearLine(process.stdout, 0);
      readline.cursorTo(process.stdout, 0);
    } else {
      process.stdout.write('\n');
    }
  }
  
  return updatedState;
};

const increment: IncrementProgressBarFunction = (state: ProgressBarState, amount = 1): ProgressBarState => 
  update(state, state.current + amount);

export {
  createProgressBar as create,
  update,
  increment
};
