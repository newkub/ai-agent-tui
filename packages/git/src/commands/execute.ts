import { spawn } from 'child_process';
import type { GitCommandOptions } from '../types/git';

export const execute = (command: string, { workingDir }: GitCommandOptions = {}): Promise<string> => {
  const normalizedCommand = command.replace(/\//g, '\\').replace(/'/g, '"');
  return new Promise((resolve, reject) => {
    const [cmd, ...args] = process.platform === 'win32' ? ['cmd', '/c', normalizedCommand] : normalizedCommand.split(' ');
    const options = workingDir ? { cwd: workingDir, shell: true } : { shell: true };
    const child = spawn(cmd, args, options);
    
    let stdout = '';
    let stderr = '';

    child.stdout.on('data', (data) => {
      stdout += data.toString();
    });

    child.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    child.on('close', (code) => {
      if (code === 0) {
        resolve(stdout.trim());
      } else {
        reject(new Error(`Command failed with code ${code}: ${stderr}`));
      }
    });

    child.on('error', (err) => {
      reject(err);
    });
  });
};
