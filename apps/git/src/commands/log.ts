import { intro, outro, select, isCancel } from '@clack/prompts';
import { getLogHistory, getCurrentBranch } from '@newkub/git';
import type { Commit } from '@newkub/git';
import type { CommandHandler } from '../types/command';
import config from '../../git-assistance.config';

const formatCommitMessage = (message: string): string => {
  if (config.commit.message.includeEmoji) {
    const type = message.split(':')[0] as keyof typeof config.commit.message.emojiMap;
    const emoji = config.commit.message.emojiMap[type] || '';
    return `${emoji} ${message}`;
  }
  return message;
};

const filterCommitsByBranch = async (commits: Commit[]): Promise<Commit[]> => {
  const currentBranch = await getCurrentBranch();
  const { protection } = config.git.branch;

  if (protection.main.protected && currentBranch === 'main') {
    return commits.filter(commit => 
      commit.branch && config.commit.validation.allowedBranches.includes(commit.branch)
    );
  }
  return commits;
};

const log: CommandHandler = async () => {
  intro('Git AI Log Viewer');

  let history = await getLogHistory();
  history = await filterCommitsByBranch(history);

  if (!history.length) {
    return {
      success: true,
      message: 'No commit history found'
    };
  }

  const formattedLog = history.map(commit => ({
    ...commit,
    message: formatCommitMessage(commit.message)
  }));

  const pageSize = 10;
  let page = 0;
  let selectedCommit: Commit | null = null;

  while (true) {
    const start = page * pageSize;
    const end = start + pageSize;
    const pageLogs = formattedLog.slice(start, end);

    if (selectedCommit) {
      console.log('\nCommit Details:');
      console.log(`Hash: ${selectedCommit.hash}`);
      console.log(`Author: ${selectedCommit.author.name} <${selectedCommit.author.email}>`);
      console.log(`Date: ${selectedCommit.date}`);
      console.log(`Message: ${selectedCommit.message}`);
      console.log(`Branch: ${selectedCommit.branch || 'unknown'}`);
      if (selectedCommit.tags?.length) {
        console.log(`Tags: ${selectedCommit.tags.join(', ')}`);
      }
      
      const detailAction = await select({
        message: 'Select action',
        options: [
          { value: 'back', label: 'Back to list' },
          { value: 'exit', label: 'Exit' }
        ]
      });
      
      if (isCancel(detailAction) || detailAction === 'exit') {
        break;
      }
      
      selectedCommit = null;
      continue;
    }

    console.log('\nCommit History:');
    console.log(pageLogs.map((commit, idx) => 
      `${idx + 1}. ${commit.hash.slice(0, 7)} ${commit.message}`
    ).join('\n'));

    const options = [
      ...(pageLogs.map((_, idx) => ({ 
        value: `commit_${idx}`, 
        label: `View commit ${idx + 1}` 
      }))),
      { value: 'next', label: 'Next Page' },
      { value: 'prev', label: 'Previous Page' },
      { value: 'exit', label: 'Exit' }
    ];

    const action = await select({
      message: 'Select action',
      options
    });

    if (isCancel(action) || action === 'exit') {
      break;
    }

    if (action === 'next') {
      if ((page + 1) * pageSize < formattedLog.length) {
        page++;
      }
    } else if (action === 'prev') {
      page = Math.max(0, page - 1);
    } else if (action.startsWith('commit_')) {
      const idx = Number.parseInt(action.split('_')[1]);
      selectedCommit = pageLogs[idx];
    }
  }

  outro('Log session ended');
  return {
    success: true,
    message: 'Log displayed successfully',
    data: formattedLog
  };
};

export default log;