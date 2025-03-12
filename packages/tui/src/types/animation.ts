import type { color } from '../core/color';

type SpinnerOptions = {
  text: string;
  spinner?: string[];
  interval?: number;
  color?: keyof typeof color;
};

type SpinnerState = {
  text: string;
  frames: string[];
  interval: number;
  color: keyof typeof color;
  currentFrame: number;
  timer: NodeJS.Timeout | null;
  isSpinning: boolean;
};

export type { SpinnerOptions, SpinnerState };
