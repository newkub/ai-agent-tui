import type { GitAssistanceConfig } from '../types/defineConfig';
import { confirm, isCancel, select, multiselect, spinner } from '@clack/prompts';
import { execa } from 'execa';
import pc from 'picocolors';
import { useModel, setConfig } from '../providers';
import { createCommit, getFileChange } from '@newkub/git';

interface GitChange {
  status: string;
  file: string;
}

interface CommitAnswers {
  type: string;
  scope: string;
  description: string;
  emoji: string;
  bulletPoints: string[];
}

const commitStrategies = {
  single: async (files: string[], config: GitAssistanceConfig): Promise<boolean> => {
    console.log(`\n${pc.cyan('Committing all staged files:')}`);
    for (const file of files) {
      console.log(`  ${pc.green('+')} ${file}`);
    }
    
    const s = spinner();
    s.start('Generating commit message...');

    const aiResponse = await useModel(
      `Generate a semantic commit message for these changes:\n${files.join('\n')}. Format: <type>(<scope>): <description>\n\n<bullet points (if any)>`
    );

    const [commitHeader, ...bulletPoints] = aiResponse.split('\n');
    const [typeScope, description] = commitHeader.split(': ');
    const [type, scope] = typeScope.replace(')', '').split('(');

    const commitMessage = `${type}${scope ? `(${scope})` : ''}: ${description}`;
    const generatedMessage = await createCommit(commitMessage);
    
    const _commitAnswers: CommitAnswers = {
      type: type || 'feat',
      scope: scope || '',
      description: description || 'Update',
      emoji: '',
      bulletPoints: bulletPoints.filter(Boolean).map(p => p.replace('- ', ''))
    };
    
    s.stop('Generated commit message');

    console.log(pc.bold(pc.green('Commit Message:')));
    console.log(`${pc.cyan(`✨ ${generatedMessage}`)}\n`);
    
    if (config.commit.message.instructions) {
      console.log(pc.cyan('Commit Instructions:'));
      console.log(config.commit.message.instructions);
      console.log();
    }
    
    await execa('git', ['commit', '-m', String(generatedMessage)]);
    console.log(pc.green('Commit successful!'));
    return true;
  },
  
  folder: async (statusFiles: string[], config: GitAssistanceConfig): Promise<boolean> => {
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
      
      try {
        await Promise.all(folderFiles.map(file => execa('git', ['add', file])));
        
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
        
        await execa('git', ['commit', '-m', String(generatedMessage)]);
        console.log(pc.green(`Successfully committed changes in ${folder}`));
      } catch (error: unknown) {
        console.error(pc.red(`Error processing ${folder}: ${error instanceof Error ? error.message : String(error)}`));
      }
    }
    
    return true;
  },
  
  type: async (statusFiles: string[], config: GitAssistanceConfig): Promise<boolean> => {
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
      
      try {
        await Promise.all(extFiles.map(file => execa('git', ['add', file])));
        
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
        
        await execa('git', ['commit', '-m', String(generatedMessage)]);
        console.log(pc.green(`Successfully committed ${ext} files`));
      } catch (error: unknown) {
        console.error(pc.red(`Error processing ${ext} files: ${error instanceof Error ? error.message : String(error)}`));
      }
    }
    
    return true;
  },
  
  manual: async (statusFiles: string[], config: GitAssistanceConfig): Promise<boolean> => {
    const fileOptions = statusFiles.map(file => {
      const path = file.slice(3);
      const status = file.slice(0, 2).trim();
      const statusMap: Record<string, { text: string, color: (text: string) => string }> = {
        'A': { text: 'Added', color: pc.green },
        'M': { text: 'Modified', color: pc.yellow },
        'D': { text: 'Deleted', color: pc.red },
        'R': { text: 'Renamed', color: pc.blue },
        'C': { text: 'Copied', color: pc.blue },
        'U': { text: 'Updated', color: pc.yellow },
        '??': { text: 'Untracked', color: pc.red }
      };
      
      let statusText = 'Changed';
      for (const [code, info] of Object.entries(statusMap)) {
        if (status.includes(code)) {
          statusText = info.text;
          break;
        }
      }
      
      return { value: path, label: `${path} (${statusText})` };
    });

    const selectedFiles = await multiselect({
      message: 'Select files to commit:',
      options: fileOptions,
    });

    if (isCancel(selectedFiles) || !selectedFiles.length) {
      console.log('Operation cancelled or no files selected');
      return false;
    }
    
    console.log(`\n${pc.cyan('Committing selected files:')}`);
    for (const file of selectedFiles as string[]) {
      console.log(`  ${pc.green('+')} ${file}`);
    }
    
    try {
      await Promise.all((selectedFiles as string[]).map(file => execa('git', ['add', file])));
      
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
      
      await execa('git', ['commit', '-m', String(generatedMessage)]);
      console.log(pc.green('Commit successful!'));
      return true;
    } catch (error: unknown) {
      console.error(pc.red(`Error: ${error instanceof Error ? error.message : String(error)}`));
      return false;
    }
  }
};

const handler = async (config?: GitAssistanceConfig): Promise<{ success: boolean }> => {
  if (!config) return { success: false };
  setConfig(config);
  console.log('Git Commit');

  try {
    const changes = getFileChange().map(line => {
      const [status, file] = line.split(' ');
      return { status, file };
    });
    if (changes.length === 0) {
      console.log('No changes to commit');
      return { success: false };
    }

    console.log(pc.cyan('Status Summary:'));
    console.log(pc.cyan(`  - Staged: ${changes.filter(change => change.status === 'A' || change.status === 'M').length}`));
    console.log(pc.cyan(`  - Unstaged: ${changes.filter(change => change.status === '??').length}`));
    console.log(pc.cyan(`  - Untracked: ${changes.filter(change => change.status === '??').length}`));
    console.log(pc.cyan(`  - Deleted: ${changes.filter(change => change.status === 'D').length}`));
    console.log(pc.cyan(`  - Renamed: ${changes.filter(change => change.status === 'R').length}`));
    console.log(pc.cyan(`  - Copied: ${changes.filter(change => change.status === 'C').length}`));
    console.log(pc.cyan(`  - Updated: ${changes.filter(change => change.status === 'U').length}`));
    console.log(pc.cyan(`  - Conflicted: ${changes.filter(change => change.status === 'UU').length}`));
    console.log(pc.cyan(`  - Ignored: ${changes.filter(change => change.status === '!!').length}`));
    console.log(pc.cyan(`  - Missing: ${changes.filter(change => change.status === '!!').length}`));
    console.log(pc.cyan(`  - Modified: ${changes.filter(change => change.status === 'M').length}`));
    console.log(pc.cyan(`  - Type changed: ${changes.filter(change => change.status === 'T').length}`));
    console.log(pc.cyan(`  - Unknown: ${changes.filter(change => change.status === '?').length}`));
    console.log();

    console.log(pc.cyan('Detailed Changes:'));
    for (const change of changes) {
      console.log(pc.cyan(`  - ${change.status} ${change.file}`));
    }
    console.log();

    // Handle unstaged changes
    if (changes.some(change => change.status === '??' || change.status === 'M')) {
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
        await execa('git', ['add', '--all']);
        s.stop('All changes staged');

        const updatedChanges = getFileChange().map(line => {
          const [status, file] = line.split(' ');
          return { status, file };
        });
        console.log(pc.cyan('Updated Status Summary:'));
        console.log(pc.cyan(`  - Staged: ${updatedChanges.filter(change => change.status === 'A' || change.status === 'M').length}`));
        console.log(pc.cyan(`  - Unstaged: ${updatedChanges.filter(change => change.status === '??').length}`));
        console.log(pc.cyan(`  - Untracked: ${updatedChanges.filter(change => change.status === '??').length}`));
        console.log(pc.cyan(`  - Deleted: ${updatedChanges.filter(change => change.status === 'D').length}`));
        console.log(pc.cyan(`  - Renamed: ${updatedChanges.filter(change => change.status === 'R').length}`));
        console.log(pc.cyan(`  - Copied: ${updatedChanges.filter(change => change.status === 'C').length}`));
        console.log(pc.cyan(`  - Updated: ${updatedChanges.filter(change => change.status === 'U').length}`));
        console.log(pc.cyan(`  - Conflicted: ${updatedChanges.filter(change => change.status === 'UU').length}`));
        console.log(pc.cyan(`  - Ignored: ${updatedChanges.filter(change => change.status === '!!').length}`));
        console.log(pc.cyan(`  - Missing: ${updatedChanges.filter(change => change.status === '!!').length}`));
        console.log(pc.cyan(`  - Modified: ${updatedChanges.filter(change => change.status === 'M').length}`));
        console.log(pc.cyan(`  - Type changed: ${updatedChanges.filter(change => change.status === 'T').length}`));
        console.log(pc.cyan(`  - Unknown: ${updatedChanges.filter(change => change.status === '?').length}`));
        console.log();

        console.log(pc.cyan('Updated Detailed Changes:'));
        for (const change of updatedChanges) {
          console.log(pc.cyan(`  - ${change.status} ${change.file}`));
        }
        console.log();
      }
    }

    // Select commit strategy
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

    // Get staged files for single commit strategy
    const stagedFiles = changes
      .filter(change => change.status === 'A' || change.status === 'M')
      .map(change => change.file);
      
    if (commitStrategy === 'single' && stagedFiles.length === 0) {
      console.log(pc.yellow('No staged files to commit. Please stage files first.'));
      console.log('Commit cancelled');
      return { success: false };
    }
    
    // Execute selected strategy
    const result = await commitStrategies[commitStrategy as keyof typeof commitStrategies](
      commitStrategy === 'single' ? stagedFiles : changes.map(change => change.file), 
      config
    );
    
    return { success: result };
  } catch (error: unknown) {
    console.error(pc.red(`An error occurred: ${error instanceof Error ? error.message : String(error)}`));
    console.error(pc.dim(String(error)));
    return { success: false };
  }
};

export default handler;
