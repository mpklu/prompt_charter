#!/usr/bin/env node

const { Command } = require('commander');
const { install } = require('./commands/install');
const { list } = require('./commands/list');
const chalk = require('chalk');
const packageJson = require('../package.json');

const program = new Command();

program
  .name('prompt-charter')
  .description('CLI tool to install curated AI coding rule sets')
  .version(packageJson.version);

program
  .command('install')
  .description('Interactively install a RULES.md file to your project')
  .option('-l, --local', 'Use local filesystem instead of GitHub (for development)')
  .action(install);

program
  .command('list')
  .description('List all available rule sets')
  .option('-l, --local', 'Use local filesystem instead of GitHub (for development)')
  .action(list);

// Default action when no command specified
program.action(() => {
  console.log(chalk.bold.cyan('\n🎯 Prompt Charter - AI Coding Rule Sets\n'));
  console.log('Install curated architectural rules to guide AI coding tools.\n');
  console.log(chalk.bold('Available commands:'));
  console.log(chalk.cyan('  install'), ' - Interactively install a rule set');
  console.log(chalk.cyan('  list'), '    - Show all available rule sets');
  console.log(chalk.cyan('  --help'), '  - Show help information\n');
  console.log(chalk.gray('Example:'), chalk.white('prompt-charter install\n'));
});

program.parse(process.argv);

// Show default help if no args provided
if (!process.argv.slice(2).length) {
  program.outputHelp();
}
