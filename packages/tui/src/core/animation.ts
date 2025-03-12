import type { SpinnerOptions, SpinnerState } from '../types/animation';
import { color } from './color';

const createSpinner = (options: SpinnerOptions): SpinnerState => ({
  text: options.text || '',
  frames: options.spinner || ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'],
  interval: options.interval || 80,
  color: options.color || 'cyan',
  currentFrame: 0,
  timer: null as NodeJS.Timeout | null,
  isSpinning: false
});

const render = (state: SpinnerState): void => {
  const frame = state.frames[state.currentFrame];
  process.stdout.write(`\r${color[state.color](frame)} ${state.text}`);
  state.currentFrame = (state.currentFrame + 1) % state.frames.length;
};

const start = (state: SpinnerState, text?: string): SpinnerState => {
  const newState = { ...state };
  if (text) newState.text = text;
  newState.isSpinning = true;
  
  if (!newState.timer) {
    render(newState);
    newState.timer = setInterval(() => render(newState), newState.interval);
  }
  
  return newState;
};

const stop = (state: SpinnerState): SpinnerState => {
  const newState = { ...state };
  
  if (newState.timer) {
    clearInterval(newState.timer);
    newState.timer = null;
    newState.isSpinning = false;
    process.stdout.write('\r\x1b[K');
  }
  
  return newState;
};

const stopWithSymbol = (
  state: SpinnerState, 
  symbol: string, 
  symbolColor: keyof typeof color, 
  text?: string
): SpinnerState => {
  const stoppedState = stop(state);
  const finalText = text || stoppedState.text;
  console.log(`${color[symbolColor](symbol)} ${finalText}`);
  return stoppedState;
};

const succeed = (state: SpinnerState, text?: string): SpinnerState => 
  stopWithSymbol(state, '✓', 'green', text);

const fail = (state: SpinnerState, text?: string): SpinnerState => 
  stopWithSymbol(state, '✖', 'red', text);

const warn = (state: SpinnerState, text?: string): SpinnerState => 
  stopWithSymbol(state, '⚠', 'yellow', text);

const info = (state: SpinnerState, text?: string): SpinnerState => 
  stopWithSymbol(state, 'ℹ', 'blue', text);

export const ora = (options: SpinnerOptions | string) => {
  const initialOptions = typeof options === 'string' ? { text: options } : options;
  const initialState = createSpinner(initialOptions);
  
  return {
    start: (text?: string) => {
      return ora({ ...start(initialState, text) });
    },
    stop: () => {
      return ora({ ...stop(initialState) });
    },
    succeed: (text?: string) => {
      return ora({ ...succeed(initialState, text) });
    },
    fail: (text?: string) => {
      return ora({ ...fail(initialState, text) });
    },
    warn: (text?: string) => {
      return ora({ ...warn(initialState, text) });
    },
    info: (text?: string) => {
      return ora({ ...info(initialState, text) });
    }
  };
};
