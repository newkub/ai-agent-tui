#!/usr/bin/env bun
import fzf, { getInput } from 'node-fzf';
import type { FzfResult } from 'node-fzf';
import * as p from '@clack/prompts';
import { readFileSync, writeFileSync } from 'fs';

// Define the modes for the AI assistant
enum Mode {
  CHAT = 'Chat Mode',
  EDIT = 'Edit Mode',
  EXPLAIN = 'Explain Mode',
  EXIT = 'Exit'
}

// Type for AI assistant history
interface ChatHistory {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

// Type for file edit history
interface EditHistory {
  filename: string;
  timestamp: Date;
  changes: string;
}

// Main class for AI Assistant
class AIAssistant {
  private history: ChatHistory[] = [];
  private editHistory: EditHistory[] = [];
  private currentMode: Mode = Mode.CHAT;
  private apiKey: string = process.env.OPENAI_API_KEY || '';

  constructor() {
    if (!this.apiKey) {
      console.warn('Warning: OPENAI_API_KEY environment variable not set');
    }
  }

  // Start the assistant
  public async start(): Promise<void> {
    p.intro('AI Assistant TUI');
    
    while (true) {
      const mode = await this.selectMode();
      
      if (mode === Mode.EXIT) {
        break;
      }
      
      this.currentMode = mode;
      await this.handleMode();
    }
    
    p.outro('Thank you for using AI Assistant!');
  }

  // Get selected value safely from FzfResult
  private getSelectedValue(result: FzfResult, defaultValue: string): string {
    try {
      if (!result || !result.selected || result.selected.length === 0) {
        return defaultValue;
      }
      
      const selected = result.selected[0];
      if (!selected || typeof selected.value !== 'string') {
        return defaultValue;
      }
      
      return selected.value;
    } catch (error) {
      console.error('Error getting selected value:', error);
      return defaultValue;
    }
  }

  // Select a mode using node-fzf
  private async selectMode(): Promise<Mode> {
    const modes = Object.values(Mode);
    
    try {
      // Use a promise-based approach for better error handling
      const selectedMode = await new Promise<Mode>((resolve) => {
        const options = {
          list: modes,
          mode: 'normal' as 'normal' | 'fuzzy',
          height: 10,
          prelinehook: (_: number) => '> ',
          selectOne: true
        };
        
        fzf(options)
          .then((result) => {
            resolve(this.getSelectedValue(result, Mode.EXIT) as Mode);
          })
          .catch((error) => {
            console.error('Error selecting mode:', error);
            resolve(Mode.EXIT);
          });
      });
      
      return selectedMode;
    } catch (error) {
      console.error('Error in selectMode:', error);
      return Mode.EXIT;
    }
  }

  // Handle the current mode
  private async handleMode(): Promise<void> {
    switch (this.currentMode) {
      case Mode.CHAT:
        await this.handleChatMode();
        break;
      case Mode.EDIT:
        await this.handleEditMode();
        break;
      case Mode.EXPLAIN:
        await this.handleExplainMode();
        break;
      default:
        break;
    }
  }

  // Handle chat mode
  private async handleChatMode(): Promise<void> {
    p.note('Chat Mode: Have a conversation with the AI assistant', 'Chat Mode');
    
    while (true) {
      try {
        const userInput = await getInput('You: ');
        
        if (!userInput || userInput.toLowerCase() === 'exit' || userInput.toLowerCase() === 'quit') {
          break;
        }
        
        // Add user message to history
        this.history.push({
          role: 'user',
          content: userInput,
          timestamp: new Date()
        });
        
        // Get AI response
        const response = await this.getAIResponse(userInput);
        
        // Add AI response to history
        this.history.push({
          role: 'assistant',
          content: response,
          timestamp: new Date()
        });
        
        console.log(`\nAI: ${response}\n`);
      } catch (error) {
        console.error('Error in chat mode:', error);
        break;
      }
    }
  }

  // Handle edit mode
  private async handleEditMode(): Promise<void> {
    p.note('Edit Mode: Edit files with AI assistance', 'Edit Mode');
    
    try {
      // Get file path
      const filePath = await getInput('Enter file path to edit: ');
      
      if (!filePath) {
        return;
      }
      
      try {
        // Read file content
        const content = readFileSync(filePath, 'utf-8');
        
        // Show file content
        console.log('\nCurrent file content:');
        console.log('-------------------');
        console.log(content);
        console.log('-------------------\n');
        
        // Get edit instructions
        const instructions = await getInput('Enter edit instructions: ');
        
        if (!instructions) {
          return;
        }
        
        // Get AI edit suggestions
        const editedContent = await this.getAIEdit(content, instructions);
        
        // Preview changes
        console.log('\nProposed changes:');
        console.log('-------------------');
        console.log(editedContent);
        console.log('-------------------\n');
        
        // Confirm changes
        const confirmOptions = ['Apply changes', 'Discard changes'];
        
        // Use a promise-based approach for better error handling
        const selectedOption = await new Promise<string>((resolve) => {
          const options = {
            list: confirmOptions,
            mode: 'normal' as 'normal' | 'fuzzy',
            height: 10,
            selectOne: true
          };
          
          fzf(options)
            .then((result) => {
              resolve(this.getSelectedValue(result, 'Discard changes'));
            })
            .catch((error) => {
              console.error('Error confirming changes:', error);
              resolve('Discard changes');
            });
        });
        
        if (selectedOption === 'Apply changes') {
          // Save changes
          writeFileSync(filePath, editedContent);
          
          // Add to edit history
          this.editHistory.push({
            filename: filePath,
            timestamp: new Date(),
            changes: instructions
          });
          
          console.log('Changes applied successfully!');
        } else {
          console.log('Changes discarded.');
        }
      } catch (error: unknown) {
        console.error(`Error editing file: ${error instanceof Error ? error.message : String(error)}`);
      }
    } catch (error) {
      console.error('Error in edit mode:', error);
    }
  }

  // Handle explain mode
  private async handleExplainMode(): Promise<void> {
    p.note('Explain Mode: Get explanations for code or concepts', 'Explain Mode');
    
    try {
      // Options for explanation
      const explainOptions = [
        'Explain code from file',
        'Explain concept or term',
        'Back to main menu'
      ];
      
      // Use a promise-based approach for better error handling
      const selectedOption = await new Promise<string>((resolve) => {
        const options = {
          list: explainOptions,
          mode: 'normal' as 'normal' | 'fuzzy',
          height: 10,
          selectOne: true
        };
        
        fzf(options)
          .then((result) => {
            resolve(this.getSelectedValue(result, 'Back to main menu'));
          })
          .catch((error) => {
            console.error('Error selecting explanation option:', error);
            resolve('Back to main menu');
          });
      });
      
      if (selectedOption === 'Back to main menu') {
        return;
      }
      
      if (selectedOption === 'Explain code from file') {
        const filePath = await getInput('Enter file path: ');
        
        if (!filePath) {
          return;
        }
        
        try {
          const content = readFileSync(filePath, 'utf-8');
          const explanation = await this.getAIExplanation(content, 'code');
          
          console.log('\nExplanation:');
          console.log('-------------------');
          console.log(explanation);
          console.log('-------------------\n');
          
          await this.waitForKeyPress('Press any key to continue...');
        } catch (error: unknown) {
          console.error(`Error reading file: ${error instanceof Error ? error.message : String(error)}`);
        }
        return;
      }
      
      const concept = await getInput('Enter concept or term to explain: ');
      
      if (!concept) {
        return;
      }
      
      const explanation = await this.getAIExplanation(concept, 'concept');
      
      console.log('\nExplanation:');
      console.log('-------------------');
      console.log(explanation);
      console.log('-------------------\n');
      
      await this.waitForKeyPress('Press any key to continue...');
    } catch (error) {
      console.error('Error in explain mode:', error);
    }
  }

  // Get AI response for chat mode
  private async getAIResponse(message: string): Promise<string> {
    // In a real implementation, this would call an AI API
    if (!this.apiKey) {
      return 'API key not set. Please set OPENAI_API_KEY environment variable.';
    }
    
    // Simulate API call with a delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Placeholder response
    return `I received your message: "${message}". This is a placeholder response. In a real implementation, this would call the OpenAI API.`;
  }

  // Get AI edit suggestions
  private async getAIEdit(content: string, instructions: string): Promise<string> {
    // In a real implementation, this would call an AI API
    if (!this.apiKey) {
      return content;
    }
    
    // Simulate API call with a delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Placeholder edit (just add a comment in this example)
    return `${content}\n\n// Edited based on instructions: ${instructions}\n// This is a placeholder edit. In a real implementation, this would call the OpenAI API.`;
  }

  // Get AI explanation
  private async getAIExplanation(content: string, type: 'code' | 'concept'): Promise<string> {
    // In a real implementation, this would call an AI API
    if (!this.apiKey) {
      return 'API key not set. Please set OPENAI_API_KEY environment variable.';
    }
    
    // Simulate API call with a delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Placeholder explanation
    if (type === 'code') {
      return "This is a placeholder explanation for the provided code. In a real implementation, this would provide a detailed explanation of the code structure, functionality, and purpose.";
    }
    
    return `This is a placeholder explanation for the concept "${content}". In a real implementation, this would provide a detailed explanation of the concept, its applications, and related information.`;
  }

  // Utility function to wait for a key press
  private async waitForKeyPress(message: string): Promise<void> {
    console.log(message);
    process.stdin.setRawMode(true);
    return new Promise(resolve => {
      process.stdin.once('data', () => {
        process.stdin.setRawMode(false);
        resolve();
      });
    });
  }

  // View chat history
  private async viewHistory(): Promise<void> {
    if (this.history.length === 0) {
      console.log('No chat history available.');
      return;
    }
    
    console.log('\nChat History:');
    console.log('-------------------');
    
    for (const entry of this.history) {
      const timestamp = entry.timestamp.toLocaleTimeString();
      const role = entry.role === 'user' ? 'You' : 'AI';
      console.log(`[${timestamp}] ${role}: ${entry.content}`);
    }
    
    console.log('-------------------\n');
    
    await this.waitForKeyPress('Press any key to continue...');
  }
}

// Main function
async function main() {
  try {
    const assistant = new AIAssistant();
    await assistant.start();
  } catch (error: unknown) {
    console.error('Error:', error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
}

// Run the main function
main();