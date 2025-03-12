export interface ProgressBarOptions {
  total: number;
  width?: number;
  complete?: string;
  incomplete?: string;
  format?: string;
  clearOnComplete?: boolean;
}

export interface ProgressBarState {
  current: number;
  total: number;
  width: number;
  complete: string;
  incomplete: string;
  format: string;
  clearOnComplete: boolean;
  startTime: number;
}

export type CreateProgressBarFunction = (options: ProgressBarOptions) => ProgressBarState;

export type UpdateProgressBarFunction = (state: ProgressBarState, value: number) => ProgressBarState;

export type IncrementProgressBarFunction = (state: ProgressBarState, amount?: number) => ProgressBarState;
