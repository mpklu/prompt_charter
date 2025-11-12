const fs = require('fs');
const path = require('path');
const inquirer = require('inquirer');
const chalk = require('chalk');
const ora = require('ora');
const {
  getAvailableDomains,
  getAvailableSubdirectories,
  fetchFileContent,
  checkDirectRules
} = require('../utils/github');
const {
  getAvailableDomainsLocal,
  getAvailableSubdirectoriesLocal,
  readLocalFile,
  checkDirectRulesLocal
} = require('../utils/local');

/**
 * Display sample usage instructions
 * @param {string} rulesPath - Path where RULES.md was saved
 * @param {number} lineCount - Number of lines in the file
 */
function displayUsage(rulesPath, lineCount) {
  console.log('\n' + chalk.green('✅ Successfully downloaded RULES.md'));
  console.log(chalk.cyan('📍 Location:'), rulesPath);
  console.log(chalk.gray(`   (${lineCount} lines)`));
  
  console.log('\n' + chalk.bold('📝 Sample Usage:\n'));
  
  console.log(chalk.yellow('1. Code Generation:'));
  console.log(chalk.gray('   "Load and obey all rules in .prompt-charter/RULES.md.'));
  console.log(chalk.gray('   Task: Implement UserService with createUser() method."\n'));
  
  console.log(chalk.yellow('2. Validation:'));
  console.log(chalk.gray('   "Load .prompt-charter/RULES.md.'));
  console.log(chalk.gray('   Validate src/services/UserService.ts for rule compliance."\n'));
  
  console.log(chalk.yellow('3. Refactoring:'));
  console.log(chalk.gray('   "Follow .prompt-charter/RULES.md rules.'));
  console.log(chalk.gray('   Refactor ScheduleStore to use ScheduleService instead of direct API calls."\n'));
  
  console.log(chalk.bold('📖 Learn More:'));
  console.log(chalk.cyan('   Advanced patterns:'), 'https://github.com/mpklu/prompt_charter/blob/main/templates/PROMPT_INJECTION.md');
  console.log(chalk.cyan('   Validation guide:'), 'https://github.com/mpklu/prompt_charter/blob/main/templates/VALIDATION_PROMPT.md');
  console.log(chalk.cyan('   Full repository:'), 'https://github.com/mpklu/prompt_charter\n');
}

/**
 * Install command implementation
 * @param {Object} options - Command options
 * @param {boolean} options.local - Use local filesystem instead of GitHub
 */
async function install(options = {}) {
  const isLocal = options.local;
  
  console.log(chalk.bold.cyan('\n🎯 Prompt Charter - Rule Set Installer'));
  if (isLocal) {
    console.log(chalk.gray('(Local filesystem mode)\n'));
  } else {
    console.log('\n');
  }
  
  // Check if .prompt-charter/RULES.md already exists
  const targetDir = path.join(process.cwd(), '.prompt-charter');
  const targetFile = path.join(targetDir, 'RULES.md');
  
  if (fs.existsSync(targetFile)) {
    console.log(chalk.yellow('⚠️  RULES.md already exists at:'), targetFile);
    console.log(chalk.gray('   Use '), chalk.cyan('prompt-charter update'), chalk.gray(' to replace it.\n'));
    return;
  }
  
  // Step 1: Fetch available domains
  const spinner = ora('Discovering available rule sets...').start();
  
  let domains;
  try {
    domains = isLocal 
      ? getAvailableDomainsLocal()
      : await getAvailableDomains();
    spinner.succeed('Found available domains');
  } catch (error) {
    spinner.fail('Failed to fetch domains');
    console.error(chalk.red('Error:'), error.message);
    if (!isLocal) {
      console.log(chalk.gray('\nTip: Check your internet connection or try again later.'));
      console.log(chalk.gray('Or use '), chalk.cyan('--local'), chalk.gray(' flag for local testing.'));
    }
    return;
  }
  
  if (domains.length === 0) {
    console.log(chalk.yellow('No rule sets available yet. Check back soon!'));
    return;
  }
  
  // Step 2: Let user select domain
  const { domain } = await inquirer.prompt([
    {
      type: 'list',
      name: 'domain',
      message: 'Select a domain:',
      choices: domains
    }
  ]);
  
  // Step 3: Navigate through subdirectories until we find RULES.md
  let currentPath = `domains/${domain}`;
  let foundRules = false;
  
  const checkFn = isLocal ? checkDirectRulesLocal : checkDirectRules;
  const getSubdirsFn = isLocal ? getAvailableSubdirectoriesLocal : getAvailableSubdirectories;
  
  while (!foundRules) {
    const spinner = ora('Checking for rule sets...').start();
    
    try {
      // Check if current directory has RULES.md
      const hasDirectRules = isLocal 
        ? checkFn(currentPath)
        : await checkFn(currentPath);
      
      if (hasDirectRules) {
        spinner.succeed('Found RULES.md');
        foundRules = true;
        break;
      }
      
      // Get subdirectories
      const subdirs = isLocal
        ? getSubdirsFn(currentPath)
        : await getSubdirsFn(currentPath);
      spinner.stop();
      
      if (subdirs.length === 0) {
        console.log(chalk.red('No RULES.md found in this path.'));
        return;
      }
      
      // If only one option, continue automatically
      if (subdirs.length === 1) {
        currentPath = `${currentPath}/${subdirs[0].name}`;
        continue;
      }
      
      // Multiple options: ask user
      const { subdir } = await inquirer.prompt([
        {
          type: 'list',
          name: 'subdir',
          message: 'Select a stack/option:',
          choices: subdirs.map(s => s.name)
        }
      ]);
      
      currentPath = `${currentPath}/${subdir}`;
      
    } catch (error) {
      spinner.fail('Error navigating directories');
      console.error(chalk.red('Error:'), error.message);
      return;
    }
  }
  
  // Step 4: Download/Read RULES.md
  const downloadSpinner = ora(isLocal ? 'Reading RULES.md...' : 'Downloading RULES.md...').start();
  
  try {
    const rulesFilePath = `${currentPath}/RULES.md`;
    const content = isLocal
      ? readLocalFile(rulesFilePath)
      : await fetchFileContent(rulesFilePath);
    
    // Create .prompt-charter directory if it doesn't exist
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }
    
    // Write RULES.md
    fs.writeFileSync(targetFile, content, 'utf8');
    
    const lineCount = content.split('\n').length;
    downloadSpinner.succeed('Downloaded RULES.md');
    
    // Step 5: Display usage instructions
    displayUsage(targetFile, lineCount);
    
  } catch (error) {
    downloadSpinner.fail('Failed to download RULES.md');
    console.error(chalk.red('Error:'), error.message);
  }
}

module.exports = { install };
