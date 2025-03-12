import { simpleGit } from 'simple-git';
import type { GitDiff } from '../types.js';
import type { StatusResult } from 'simple-git';

const createGitService = (workingDir: string = process.cwd()) => {
  const git = simpleGit(workingDir);

  /**
   * Check if the current directory is a git repository
   */
  const isGitRepository = async (): Promise<boolean> => {
    try {
      await git.revparse(['--is-inside-work-tree']);
      return true;
    } catch {
      // Repository is not a git directory
      return false;
    }
  };

  /**
   * Check if there are staged changes
   */
  const hasStagedChanges = async (): Promise<boolean> => {
    const status = await git.status();
    return status.staged.length > 0;
  };

  /**
   * Check if there are unstaged changes
   */
  const hasUnstagedChanges = async (): Promise<boolean> => {
    const status = await git.status();
    return status.not_added.length > 0 || status.modified.length > 0 || status.deleted.length > 0;
  };

  /**
   * Get unstaged changes
   */
  const getUnstagedChanges = async (): Promise<{
    files: { filename: string; status: string }[];
    summary: { files: number };
  }> => {
    const status = await git.status();
    
    // Combine all unstaged files
    const unstagedFiles = [
      ...status.not_added.map(filename => ({ filename, status: 'not_added' })),
      ...status.modified.filter(filename => !status.staged.includes(filename))
        .map(filename => ({ filename, status: 'modified' })),
      ...status.deleted.filter(filename => !status.staged.includes(filename))
        .map(filename => ({ filename, status: 'deleted' }))
    ];
    
    return {
      files: unstagedFiles,
      summary: {
        files: unstagedFiles.length
      }
    };
  };

  /**
   * Stage all changes
   */
  const stageAllChanges = async (): Promise<void> => {
    await git.add('.');
  };

  /**
   * Stage specific files
   */
  const stageFiles = async (files: string[]): Promise<void> => {
    if (files.length === 0) return;
    await git.add(files);
  };

  /**
   * Get the status of a file
   */
  const getFileStatus = (status: StatusResult, filename: string): string => {
    if (status.created.includes(filename)) return 'created';
    if (status.modified.includes(filename)) return 'modified';
    if (status.deleted.includes(filename)) return 'deleted';
    if (status.renamed.find((item: { to: string }) => item.to === filename)) return 'renamed';
    return 'unknown';
  };

  /**
   * Get the diff of staged changes
   */
  const getStagedDiff = async (): Promise<GitDiff> => {
    // Get the list of staged files
    const status = await git.status();
    const stagedFiles = status.staged;
    
    if (stagedFiles.length === 0) {
      throw new Error('No staged changes found');
    }
    
    const files = await Promise.all(
      stagedFiles.map(async (filename) => {
        // Get the diff for the file
        const diff = await git.diff(['--cached', '--', filename]);
        
        // Count additions and deletions
        const lines = diff.split('\n');
        const additions = lines.filter(line => line.startsWith('+')).length;
        const deletions = lines.filter(line => line.startsWith('-')).length;
        
        return {
          filename,
          status: getFileStatus(status, filename),
          additions,
          deletions,
          diff
        };
      })
    );
    
    // Calculate summary
    const summary = {
      files: files.length,
      additions: files.reduce((sum, file) => sum + file.additions, 0),
      deletions: files.reduce((sum, file) => sum + file.deletions, 0)
    };
    
    return { files, summary };
  };

  /**
   * Get the diff of unstaged changes
   */
  const getUnstagedDiff = async (): Promise<GitDiff> => {
    // Get the list of unstaged files
    const status = await git.status();
    
    // Combine all unstaged files
    const unstagedFiles = [
      ...status.not_added,
      ...status.modified.filter(filename => !status.staged.includes(filename)),
      ...status.deleted.filter(filename => !status.staged.includes(filename))
    ];
    
    if (unstagedFiles.length === 0) {
      throw new Error('No unstaged changes found');
    }
    
    const files = await Promise.all(
      unstagedFiles.map(async (filename) => {
        try {
          // Get the diff for the file
          let diff = '';
          
          if (status.not_added.includes(filename)) {
            // For untracked files, get the file content
            try {
              const content = await git.raw(['show', `:${filename}`]);
              diff = `+++ b/${filename}\n` + content.split('\n').map(line => `+${line}`).join('\n');
            } catch {
              // File might not be readable or might be binary
              diff = `+++ b/${filename}\n+[File content not available]`;
            }
          } else {
            // For tracked files, get the diff
            diff = await git.diff(['--', filename]);
          }
          
          // Count additions and deletions
          const lines = diff.split('\n');
          const additions = lines.filter(line => line.startsWith('+')).length;
          const deletions = lines.filter(line => line.startsWith('-')).length;
          
          return {
            filename,
            status: getFileStatus(status, filename),
            additions,
            deletions,
            diff
          };
        } catch (error) {
          // If there's an error getting the diff, return a placeholder
          return {
            filename,
            status: getFileStatus(status, filename),
            additions: 0,
            deletions: 0,
            diff: `Error getting diff for ${filename}`
          };
        }
      })
    );
    
    // Calculate summary
    const summary = {
      files: files.length,
      additions: files.reduce((sum, file) => sum + file.additions, 0),
      deletions: files.reduce((sum, file) => sum + file.deletions, 0)
    };
    
    return { files, summary };
  };

  /**
   * Commit changes with the given message
   */
  const commit = async (message: string): Promise<void> => {
    await git.commit(message);
  };

  /**
   * Reset staged changes (unstage all files)
   */
  const resetStaged = async (): Promise<void> => {
    await git.reset(['--mixed']);
  };

  /**
   * Get the current branch name
   */
  const getCurrentBranch = async (): Promise<string> => {
    const result = await git.branch();
    return result.current;
  };

  /**
   * Get the git status
   */
  const getStatus = async (): Promise<StatusResult> => {
    return await git.status();
  };

  /**
   * Push to remote
   */
  const push = async (branch: string): Promise<string> => {
    try {
      const result = await git.push('origin', branch);
      return result.toString();
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to push: ${error.message}`);
      }
      throw new Error('Failed to push to remote');
    }
  };

  /**
   * Execute a git command
   */
  const executeCommand = async (command: string): Promise<string> => {
    try {
      // Split the command into parts, assuming the first word is 'git'
      const parts = command.trim().split(' ');
      
      // Remove 'git' if it's the first part
      if (parts[0].toLowerCase() === 'git') {
        parts.shift();
      }
      
      // Execute the command
      const result = await git.raw(parts);
      return result || 'Command executed successfully';
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Command failed: ${error.message}`);
      }
      throw new Error('Command execution failed');
    }
  };

  return {
    isGitRepository,
    hasStagedChanges,
    hasUnstagedChanges,
    getUnstagedChanges,
    stageAllChanges,
    stageFiles,
    getStagedDiff,
    getUnstagedDiff,
    commit,
    resetStaged,
    getCurrentBranch,
    getStatus,
    push,
    executeCommand
  };
};

type GitService = ReturnType<typeof createGitService>;

export { createGitService, GitService };
