const chalk = require('chalk');
const ora = require('ora');
const { discoverAllRuleSets } = require('../utils/github');
const { discoverAllRuleSetsLocal } = require('../utils/local');

/**
 * List command implementation - shows all available rule sets
 * @param {Object} options - Command options
 * @param {boolean} options.local - Use local filesystem instead of GitHub
 */
async function list(options = {}) {
  const isLocal = options.local;
  
  console.log(chalk.bold.cyan('\n📋 Available Rule Sets'));
  if (isLocal) {
    console.log(chalk.gray('(Local filesystem mode)\n'));
  } else {
    console.log(chalk.gray('(GitHub remote)\n'));
  }
  
  const spinner = ora('Discovering rule sets...').start();
  
  try {
    const ruleSets = isLocal 
      ? discoverAllRuleSetsLocal()
      : await discoverAllRuleSets();
    spinner.succeed(`Found ${ruleSets.length} rule set(s)`);
    
    if (ruleSets.length === 0) {
      console.log(chalk.yellow('\nNo rule sets available yet. Check back soon!'));
      return;
    }
    
    console.log('');
    
    // Group by domain
    const byDomain = ruleSets.reduce((acc, ruleSet) => {
      if (!acc[ruleSet.domain]) {
        acc[ruleSet.domain] = [];
      }
      acc[ruleSet.domain].push(ruleSet);
      return acc;
    }, {});
    
    // Display grouped results
    Object.entries(byDomain).forEach(([domain, sets]) => {
      console.log(chalk.bold.yellow(`${domain}/`));
      sets.forEach(set => {
        const subpath = set.path.replace(`${domain}/`, '');
        console.log(chalk.gray('  └─'), chalk.cyan(subpath));
      });
      console.log('');
    });
    
    console.log(chalk.gray('To install a rule set, run:'), chalk.cyan('prompt-charter install'));
    console.log('');
    
  } catch (error) {
    spinner.fail('Failed to discover rule sets');
    console.error(chalk.red('Error:'), error.message);
    console.log(chalk.gray('\nTip: Check your internet connection or try again later.'));
  }
}

module.exports = { list };
