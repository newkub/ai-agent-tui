import { intro, select, text, confirm, isCancel, outro } from '@clack/prompts';
import pc from 'picocolors';
import semver from 'semver';
import { getCurrentBranch, getLatestTag, generateChangelog } from '@newkub/git';
import { execa } from 'execa';

const bumpVersion = (_currentVersion: string, type: semver.ReleaseType): string => {
  return semver.inc(_currentVersion, type) || _currentVersion;
};

const releaseHandler = async () => {
  intro(pc.bold('Git Release'));

  try {
    const currentBranch = await getCurrentBranch();
    const latestTag = await getLatestTag() || '0.0.0';
    
    console.log(`${pc.dim('Current branch:')} ${pc.green(currentBranch)}`);
    console.log(`${pc.dim('Latest tag:')} ${pc.yellow(latestTag)}`);

    const releaseType = await select({
      message: 'Select release type:',
      options: [
        { value: 'patch', label: 'Patch (bug fixes)' },
        { value: 'minor', label: 'Minor (new features)' },
        { value: 'major', label: 'Major (breaking changes)' }
      ]
    });

    if (isCancel(releaseType)) {
      outro('Release cancelled');
      return { success: false, message: 'Release cancelled by user' };
    }

    const customVersion = await confirm({
      message: 'Do you want to specify a custom version?',
      initialValue: false
    });

    let version = '';
    if (customVersion === true) {
      version = await text({
        message: 'Enter version (e.g. 1.2.3):',
        validate: (input) => {
          if (!semver.valid(input)) {
            return 'Please enter a valid semver version (e.g. 1.2.3)';
          }
        }
      }) as string;
      
      if (isCancel(version)) {
        outro('Release cancelled');
        return { success: false, message: 'Release cancelled by user' };
      }
    } else {
      version = bumpVersion(latestTag, releaseType as semver.ReleaseType);
    }

    // Generate changelog
    await generateChangelog(version);

    // Create tag and commit
    await execa('git', ['add', 'CHANGELOG.md']);
    await execa('git', ['commit', '-m', `chore(release): ${version}`]);
    await execa('git', ['tag', '-a', version, '-m', `Release ${version}`]);

    console.log(`${pc.green('✓')} Created release ${pc.bold(version)}`);

    const shouldPush = await confirm({
      message: 'Push the release to remote?',
      initialValue: true
    });
    
    if (shouldPush) {
      await execa('git', ['push', 'origin', currentBranch]);
      await execa('git', ['push', 'origin', version]);
      console.log(`${pc.green('✓')} Pushed release to remote`);
    }
    
    outro(pc.green('Release completed successfully!'));
    return { success: true, message: 'Release completed successfully' };
  } catch (error) {
    console.error(pc.red('Error creating release:'), error);
    outro(pc.red('Release failed'));
    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'Release failed',
      error: error instanceof Error ? error : undefined
    };
  }
};

export default releaseHandler;
