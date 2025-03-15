export type ChatCompletionRequestMessage = {
  role: 'user' | 'assistant' | 'system'
  content: string
}
