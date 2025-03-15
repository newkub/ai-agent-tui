import { ChatCompletionRequestMessage } from './types'

interface ChatOptions {
  messages: ChatCompletionRequestMessage[]
}

interface ChatResponse {
  choices: Array<{
    message: {
      content: string
    }
  }>
}

export function useAI() {
  return {
    chat: async (options: ChatOptions): Promise<ChatResponse> => {
      // TODO: Implement actual AI chat functionality
      return {
        choices: [{
          message: {
            content: 'Mock AI response'
          }
        }]
      }
    }
  }
}
