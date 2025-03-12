export interface RGB {
  r: number;
  g: number;
  b: number;
}

export interface HEX {
  hex: string;
}

export interface HSL {
  h: number;
  s: number;
  l: number;
}

export type Color = RGB | HEX | HSL;