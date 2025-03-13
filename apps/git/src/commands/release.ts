import config from '../../git-assistance.config';
import { WebClient } from '@slack/web-api';
import nodemailer from 'nodemailer';

const release = async () => {
  const { versioning, changelog, notifications } = config.release;

  if (!notifications) {
    throw new Error('Notifications configuration is missing');
  }

  // Implement semantic versioning
  const version = await getSemanticVersion(versioning.strategy, versioning.preReleaseTag || '');

  // Generate changelog
  const changelogContent = await generateChangelog(changelog.template, changelog.includeTypes);

  // Send notifications
  if (notifications.slack) {
    await sendSlackNotification(notifications.slack, `New release: ${version}`);
  }
  if (notifications.email) {
    await sendEmailNotification(notifications.email, `New release: ${version}`, changelogContent || '');
  }

  console.log(`Successfully released version ${version}`);
};

const getSemanticVersion = async (_strategy: string, preReleaseTag: string): Promise<string> => {
  const latestTag = await getLatestGitTag();
  const [major, minor, patch] = latestTag.split('.').map(Number);
  const newVersion = `${major}.${minor}.${patch + 1}`;
  return preReleaseTag ? `${newVersion}-${preReleaseTag}` : newVersion;
};

const generateChangelog = async (_template: string, includeTypes: string[]): Promise<string> => {
  const gitLog = await getGitLog();
  return gitLog
    .split('\n')
    .filter(line => includeTypes.some(type => line.startsWith(type)))
    .join('\n');
};

const sendSlackNotification = async (webhookUrl: string, message: string): Promise<void> => {
  const slack = new WebClient(webhookUrl);
  await slack.chat.postMessage({
    channel: '#releases',
    text: message
  });
};

const sendEmailNotification = async (emails: string[], subject: string, body: string): Promise<void> => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  });

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: emails.join(','),
    subject,
    text: body
  });
};

const getLatestGitTag = async (): Promise<string> => {
  // Implementation to get latest git tag
  return '1.0.0';
};

const getGitLog = async (): Promise<string> => {
  // Implementation to get git log
  return 'Git log content';
};

export default release;