import { Glob } from 'bun';

type CommandFunction = (args: string[]) => Promise<void> | void;

const glob = new Glob('*.ts');
const commandFiles = await Array.fromAsync(glob.scan({ cwd: import.meta.dir }));
const commands: Record<string, CommandFunction> = {};

// Skip this index file and load all other command modules
for (const file of commandFiles) {
  if (file !== 'index.ts') {
    const moduleName = file.replace('.ts', '');
    const module = await import(`./${moduleName}`);
    commands[moduleName] = module.default;
  }
}

export default commands;