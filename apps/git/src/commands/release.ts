import { intro, outro, text, isCancel, cancel } from '@clack/prompts';
import { suggestVersion } from '@newkub/ai';
import { getLatestTag, createRelease } from '@newkub/git';
import type { CommandHandler } from '../types/command';

const release: CommandHandler = async () => {
  intro('Git AI Release Assistant');    

  const currentVersion = await getLatestTag();
  const suggestedVersion = await suggestVersion(currentVersion);

  const version = await text({
    message: 'Release version',
    placeholder: suggestedVersion,
  });

  if (isCancel(version)) {
    cancel('Release cancelled');
    return {
      success: false,
      message: 'Release cancelled'
    };
  }

  await createRelease(version);
  outro(`Release ${version} created successfully`);
  return {
    success: true,
    message: `Release ${version} created successfully`
  };
};

export default release;