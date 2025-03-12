export interface Capabilities {
  textgen(prompt: string): Promise<string>;
  imagegen(prompt: string): Promise<string>;
}
