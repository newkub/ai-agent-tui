import { intro, outro } from '@clack/prompts';
import { getCommits } from '../lib/git';
import type { CommandHandler, CommandResponse } from '../types/command';

const log: CommandHandler = async () => {
  intro('Git AI Log Viewer');

  const history = await getCommits();

  if (!history.length) {
    return {
      success: true,
      message: 'No commit history found'
    };
  }

  const formattedLog = history;
  console.log(formattedLog);

  outro('Log displayed successfully');
  return {
    success: true,
    message: 'Log displayed successfully',
    data: formattedLog
  };
};

export default log;