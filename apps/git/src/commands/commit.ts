import type { GitAssistanceConfig } from '../types/defineConfig';
import { confirm, isCancel, select, multiselect, spinner } from '@clack/prompts';
import { execa } from 'execa';
import pc from 'picocolors';
import { useModel, setConfig } from '../providers';

interface CommitMessageConfig {
  emoji: {
    enabled: boolean;
  };
  bulletPoints: {
    enabled: boolean;
    maxItems: number;
  };
  translate: {
    enabled: boolean;
  };
}

interface CommitAnswers {
  type: string;
  scope: string;
  description: string;
  emoji: string;
  bulletPoints: string[];
}

function generateCommitMessage(config: CommitMessageConfig, answers: CommitAnswers): string {
  const { type, scope, description, emoji } = answers;
  
  // Start with type and scope
  let message = `${type}${scope ? `(${scope})` : ''}: ${description}`;

  // Add emoji if enabled
  if (config.emoji.enabled && emoji) {
    message += ` ${emoji}`;
  }

  // Translate if enabled
  if (config.translate.enabled) {
    message = translateMessage(message, config.translate);
  }

  return message;
}

function translateMessage(message: string, translateConfig: any): string {
  // Implement translation logic here
  return message;
}

const handler = async (config: GitAssistanceConfig): Promise<{ success: boolean }> => {
  setConfig(config);
  console.log('Git Commit');

  try {
    // Check git status
    const { stdout: statusOutput } = await execa('git', ['status', '--porcelain']);
    const statusFiles = statusOutput.split('\n').filter(Boolean);

    if (!statusFiles.length) {
      console.log('No changes to commit');
      return { success: false };
    }

    // Display git status summary
    const staged = statusFiles.filter(f => !f.startsWith(' ')).length;
    const unstaged = statusFiles.filter(f => f.startsWith(' ')).length;
    const untracked = statusFiles.filter(f => f.startsWith('??')).length;
    
    console.log(pc.cyan('Git Status Summary:'));
    console.log(`  ${pc.green(`${staged} staged changes`)}`);
    console.log(`  ${pc.yellow(`${unstaged} unstaged changes`)}`);
    console.log(`  ${pc.red(`${untracked} untracked files`)}`);
    console.log();

    // Display detailed changes
    console.log(pc.cyan('Detailed Changes:'));
    const statusMap = {
      'A': { text: 'Added', color: pc.green },
      'M': { text: 'Modified', color: pc.yellow },
      'D': { text: 'Deleted', color: pc.red },
      'R': { text: 'Renamed', color: pc.blue },
      'C': { text: 'Copied', color: pc.blue },
      'U': { text: 'Updated', color: pc.yellow },
      '??': { text: 'Untracked', color: pc.red }
    };

    for (const file of statusFiles) {
      const status = file.slice(0, 2).trim();
      const path = file.slice(3);
      
      let statusText = '';
      let statusColor = pc.red;
      
      for (const [code, info] of Object.entries(statusMap)) {
        if (status.includes(code)) {
          statusText = info.text;
          statusColor = info.color;
          break;
        }
      }
      
      if (!statusText) statusText = status;
      const isStaged = !file.startsWith(' ') && !file.startsWith('??');
      console.log(`  ${statusColor(`[${statusText}]`)} ${path} ${isStaged ? pc.green('(staged)') : pc.yellow('(not staged)')}`);
    }
    console.log();

    // Ask if user wants to stage all changes
    if (unstaged > 0 || untracked > 0) {
      const stageChanges = await confirm({
        message: 'Stage all changes before committing?',
        initialValue: true
      });
      
      if (isCancel(stageChanges)) {
        console.log('Operation cancelled');
        return { success: false };
      }
      
      if (stageChanges) {
        const s = spinner();
        s.start('Staging all changes...');
        await execa('git', ['add', '.']);
        s.stop('All changes staged');
      }
    }

    // Commit strategy selection
    const commitStrategy = await select({
      message: 'Choose a commit strategy:',
      options: [
        { value: 'single', label: 'Single commit for all changes' },
        { value: 'folder', label: 'Separate commits by folder' },
        { value: 'type', label: 'Separate commits by file type' },
        { value: 'manual', label: 'Manually select files to commit' }
      ]
    });

    if (isCancel(commitStrategy)) {
      console.log('Operation cancelled');
      return { success: false };
    }

    if (commitStrategy === 'single') {
      // Single commit for all staged files
      const stagedFiles = statusFiles
        .filter(file => !file.startsWith(' ') && !file.startsWith('??'))
        .map(file => file.slice(3));
      
      if (stagedFiles.length === 0) {
        console.log(pc.yellow('No staged files to commit. Please stage files first.'));
        console.log('Commit cancelled');
        return { success: false };
      }
      
      console.log(`\n${pc.cyan('Committing all staged files:')}`);
      for (const file of stagedFiles) {
        console.log(`  ${pc.green('+')} ${file}`);
      }
      
      const s = spinner();
      s.start('Generating commit message...');

      // Generate commit message using AI
      const aiResponse = await useModel(
        `Generate a semantic commit message for these changes:\n${stagedFiles.join('\n')}. Format: <type>(<scope>): <description>\n\n<bullet points (if any)>`
      );

      // Parse AI response
      const [commitHeader, ...bulletPoints] = aiResponse.split('\n');
      const [typeScope, description] = commitHeader.split(': ');
      const [type, scope] = typeScope.replace(')', '').split('(');

      const commitMessageConfig: CommitMessageConfig = {
        emoji: true,
        bulletPoints: {
          enabled: false,
          maxItems: 5
        },
        translate: {
          enabled: false
        }
      };
      const commitAnswers: CommitAnswers = {
        type: type || 'feat',
        scope: scope || '',
        description: description || 'Update',
        emoji: '',
        bulletPoints: bulletPoints.filter(Boolean).map(p => p.replace('- ', ''))
      };
      const generatedMessage = generateCommitMessage(commitMessageConfig, commitAnswers);

      s.stop('Generated commit message');

      console.log(pc.bold(pc.green('Commit Message:')));
      console.log(`${pc.cyan(`✨ ${generatedMessage}`)}\n`);
      
      if (config.commit.message.instructions) {
        console.log(pc.cyan('Commit Instructions:'));
        console.log(config.commit.message.instructions);
        console.log();
      }
      
      // Remove the confirmation prompt and directly commit
      await execa('git', ['commit', '-m', String(generatedMessage)]);
      console.log(pc.green('Commit successful!'));
    } else if (commitStrategy === 'folder') {
      // Group files by folder
      const folders = new Set<string>();
      for (const file of statusFiles) {
        const path = file.slice(3);
        const folder = path.includes('/') ? path.split('/')[0] : '.';
        folders.add(folder);
      }

      for (const folder of folders) {
        const folderFiles = statusFiles
          .filter(file => {
            const path = file.slice(3);
            return folder === '.' ? !path.includes('/') : path.startsWith(`${folder}/`);
          })
          .map(file => file.slice(3));
        
        console.log(`\n${pc.cyan('Committing files in')} ${pc.yellow(folder)}`);
        for (const file of folderFiles) {
          console.log(`  ${pc.green('+')} ${file}`);
        }
        
        // Add files in this folder - fix path issues by not prepending folder name
        try {
          for (const file of folderFiles) {
            await execa('git', ['add', file]);
          }
        } catch (error: unknown) {
          if (error instanceof Error) {
            console.error(pc.red(`Error adding files: ${error.message}`));
          } else {
            console.error('An unknown error occurred:', error);
          }
          console.error(pc.dim(String(error)));
          continue;
        }
        
        const s = spinner();
        s.start('Generating commit message...');
        const generatedMessage = await useModel(
          `Generate a concise and descriptive commit message and description for these changes in ${folder}: ${folderFiles.join('\n')}. Format the response as:
          Commit Message: <message>
          Description: <description>`
        );
        s.stop('Generated commit message');

        const [commitMessage, description] = generatedMessage.split('\nDescription: ');
        const formattedCommitMessage = commitMessage.replace('Commit Message: ', '');

        console.log(pc.bold(pc.green('Commit Message:')));
        console.log(`${pc.cyan(`✨ ${formattedCommitMessage}`)}\n`);
        console.log(pc.bold(pc.green('Description:')));
        console.log(`${pc.cyan(description)}\n`);
        
        if (config.commit.message.instructions) {
          console.log(pc.cyan('Commit Instructions:'));
          console.log(config.commit.message.instructions);
          console.log();
        }
        
        // Remove the confirmation prompt and directly commit
        await execa('git', ['commit', '-m', String(generatedMessage)]);
        console.log(pc.green(`Successfully committed changes in ${folder}`));
      }
    } else if (commitStrategy === 'type') {
      // Group by file extension
      const extensions = new Set<string>();
      for (const file of statusFiles) {
        const path = file.slice(3);
        const ext = path.includes('.') ? path.split('.').pop() || 'no-ext' : 'no-ext';
        extensions.add(ext);
      }

      for (const ext of extensions) {
        const extFiles = statusFiles
          .filter(file => {
            const path = file.slice(3);
            return path.endsWith(`.${ext}`) || (ext === 'no-ext' && !path.includes('.'));
          })
          .map(file => file.slice(3));
        
        console.log(`\n${pc.cyan('Committing')} ${pc.yellow(ext)} ${pc.cyan('files')}`);
        for (const file of extFiles) {
          console.log(`  ${pc.green('+')} ${file}`);
        }
        
        // Add files with this extension - fix path issues by not modifying paths
        try {
          for (const file of extFiles) {
            await execa('git', ['add', file]);
          }
        } catch (error: unknown) {
          if (error instanceof Error) {
            console.error(pc.red(`Error adding files: ${error.message}`));
          } else {
            console.error('An unknown error occurred:', error);
          }
          console.error(pc.dim(String(error)));
          continue;
        }
        
        const s = spinner();
        s.start('Generating commit message...');
        const generatedMessage = await useModel(
          `Generate a concise and descriptive commit message and description for these ${ext} files: ${extFiles.join('\n')}. Format the response as:
          Commit Message: <message>
          Description: <description>`
        );
        s.stop('Generated commit message');

        const [commitMessage, description] = generatedMessage.split('\nDescription: ');
        const formattedCommitMessage = commitMessage.replace('Commit Message: ', '');

        console.log(pc.bold(pc.green('Commit Message:')));
        console.log(`${pc.cyan(`✨ ${formattedCommitMessage}`)}\n`);
        console.log(pc.bold(pc.green('Description:')));
        console.log(`${pc.cyan(description)}\n`);
        
        if (config.commit.message.instructions) {
          console.log(pc.cyan('Commit Instructions:'));
          console.log(config.commit.message.instructions);
          console.log();
        }
        
        // Remove the confirmation prompt and directly commit
        await execa('git', ['commit', '-m', String(generatedMessage)]);
        console.log(pc.green(`Successfully committed ${ext} files`));
      }
    } else if (commitStrategy === 'manual') {
      // Let user select files manually
      const fileOptions = statusFiles.map(file => {
        const path = file.slice(3);
        const status = file.slice(0, 2).trim();
        let statusText = 'Changed';
        
        for (const [code, info] of Object.entries(statusMap)) {
          if (status.includes(code)) {
            statusText = info.text;
            break;
          }
        }
        
        return { 
          value: path, 
          label: `${path} (${statusText})` 
        };
      });

      const selectedFiles = await multiselect({
        message: 'Select files to commit:',
        options: fileOptions,
      });

      if (isCancel(selectedFiles) || !selectedFiles.length) {
        console.log('Operation cancelled or no files selected');
        return { success: false };
      }
      
      console.log(`\n${pc.cyan('Committing selected files:')}`);
      for (const file of selectedFiles as string[]) {
        console.log(`  ${pc.green('+')} ${file}`);
      }
      
      // Add selected files - fix path issues by not modifying paths
      try {
        for (const file of selectedFiles as string[]) {
          await execa('git', ['add', file]);
        }
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error(pc.red(`Error adding files: ${error.message}`));
        } else {
          console.error('An unknown error occurred:', error);
        }
        console.error(pc.dim(String(error)));
        console.log('Commit failed');
        return { success: false };
      }
      
      const s = spinner();
      s.start('Generating commit message...');
      const generatedMessage = await useModel(
        `Generate a concise and descriptive commit message and description for these selected files: ${selectedFiles.join('\n')}. Format the response as:
        Commit Message: <message>
        Description: <description>`
      );
      s.stop('Generated commit message');

      const [commitMessage, description] = generatedMessage.split('\nDescription: ');
      const formattedCommitMessage = commitMessage.replace('Commit Message: ', '');

      console.log(pc.bold(pc.green('Commit Message:')));
      console.log(`${pc.cyan(`✨ ${formattedCommitMessage}`)}\n`);
      console.log(pc.bold(pc.green('Description:')));
      console.log(`${pc.cyan(description)}\n`);
      
      if (config.commit.message.instructions) {
        console.log(pc.cyan('Commit Instructions:'));
        console.log(config.commit.message.instructions);
        console.log();
      }
      
      // Remove the confirmation prompt and directly commit
      await execa('git', ['commit', '-m', String(generatedMessage)]);
      console.log(pc.green('Commit successful!'));
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(pc.red(`An error occurred: ${error.message}`));
    } else {
      console.error('An unknown error occurred:', error);
    }
    console.error(pc.dim(String(error)));
    console.log('Operation failed');
    return { success: false };
  }

  console.log('Operation completed');
  return { success: true };
};

export default handler;
