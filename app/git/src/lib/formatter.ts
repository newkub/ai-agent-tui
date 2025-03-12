export const formatLog = (history: string[]): string => {
  // Create table with dividing lines between rows
  const table = history
    .map((entry, index) => {
      const [hash, message] = entry.split(' ');
      return `| ${hash} | ${message} |`;
    })
    .join(`\n${'-'.repeat(80)}\n`);

  return table;
};
