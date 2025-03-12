export interface CapabilityParams {
  prompt: string;
}

export interface TextGenParams {
  prompt: string;
  temperature?: number;
  maxTokens?: number;
}

export interface ImageGenParams {
  prompt: string;
  size?: '256x256' | '512x512' | '1024x1024';
}
