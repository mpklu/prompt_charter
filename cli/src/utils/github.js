const axios = require('axios');

const GITHUB_API_BASE = 'https://api.github.com';
const REPO_OWNER = 'mpklu';
const REPO_NAME = 'prompt_charter';
const BRANCH = 'main';

/**
 * Fetch contents of a directory from GitHub
 * @param {string} path - Path relative to repo root (e.g., 'domains/frontend')
 * @returns {Promise<Array>} Array of file/directory objects
 */
async function fetchDirectoryContents(path) {
  const url = `${GITHUB_API_BASE}/repos/${REPO_OWNER}/${REPO_NAME}/contents/${path}?ref=${BRANCH}`;
  
  try {
    const response = await axios.get(url, {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'prompt-charter-cli'
      }
    });
    return response.data;
  } catch (error) {
    if (error.response?.status === 404) {
      return [];
    }
    throw new Error(`Failed to fetch directory contents: ${error.message}`);
  }
}

/**
 * Fetch raw file content from GitHub
 * @param {string} path - Path to file (e.g., 'domains/frontend/mst_react_mui/RULES.md')
 * @returns {Promise<string>} File content
 */
async function fetchFileContent(path) {
  const url = `https://raw.githubusercontent.com/${REPO_OWNER}/${REPO_NAME}/${BRANCH}/${path}`;
  
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch file content: ${error.message}`);
  }
}

/**
 * Recursively check if a path contains RULES.md
 * @param {string} path - Directory path to check
 * @returns {Promise<boolean>}
 */
async function hasRulesFile(path) {
  try {
    const contents = await fetchDirectoryContents(path);
    
    // Check if RULES.md exists in current directory
    const hasRules = contents.some(item => 
      item.type === 'file' && item.name === 'RULES.md'
    );
    
    if (hasRules) return true;
    
    // Check subdirectories
    const subdirs = contents.filter(item => item.type === 'dir');
    
    for (const dir of subdirs) {
      const subHasRules = await hasRulesFile(dir.path);
      if (subHasRules) return true;
    }
    
    return false;
  } catch (error) {
    return false;
  }
}

/**
 * Get all domain directories that eventually contain RULES.md files
 * @returns {Promise<Array<string>>}
 */
async function getAvailableDomains() {
  const contents = await fetchDirectoryContents('domains');
  const domains = contents.filter(item => item.type === 'dir');
  
  const availableDomains = [];
  
  for (const domain of domains) {
    if (await hasRulesFile(domain.path)) {
      availableDomains.push(domain.name);
    }
  }
  
  return availableDomains;
}

/**
 * Get subdirectories under a path that contain RULES.md
 * @param {string} path - Path to check
 * @returns {Promise<Array<{name: string, hasDirectRules: boolean}>>}
 */
async function getAvailableSubdirectories(path) {
  const contents = await fetchDirectoryContents(path);
  
  // Check if current directory has RULES.md
  const hasDirectRules = contents.some(item => 
    item.type === 'file' && item.name === 'RULES.md'
  );
  
  if (hasDirectRules) {
    return [{ name: '.', hasDirectRules: true }];
  }
  
  // Get subdirectories
  const subdirs = contents.filter(item => item.type === 'dir');
  const available = [];
  
  for (const dir of subdirs) {
    if (await hasRulesFile(dir.path)) {
      const dirHasDirectRules = await checkDirectRules(dir.path);
      available.push({
        name: dir.name,
        hasDirectRules: dirHasDirectRules
      });
    }
  }
  
  return available;
}

/**
 * Check if a directory directly contains RULES.md (not in subdirectories)
 * @param {string} path
 * @returns {Promise<boolean>}
 */
async function checkDirectRules(path) {
  const contents = await fetchDirectoryContents(path);
  return contents.some(item => 
    item.type === 'file' && item.name === 'RULES.md'
  );
}

/**
 * Discover all available rule sets with their full paths
 * @returns {Promise<Array<{domain: string, path: string, fullPath: string}>>}
 */
async function discoverAllRuleSets() {
  const ruleSets = [];
  
  async function traverse(basePath, domain) {
    const contents = await fetchDirectoryContents(basePath);
    
    // Check if RULES.md exists here
    const rulesFile = contents.find(item => 
      item.type === 'file' && item.name === 'RULES.md'
    );
    
    if (rulesFile) {
      ruleSets.push({
        domain,
        path: basePath.replace('domains/', ''),
        fullPath: basePath + '/RULES.md'
      });
      return; // Don't traverse deeper if we found RULES.md
    }
    
    // Traverse subdirectories
    const subdirs = contents.filter(item => item.type === 'dir');
    for (const dir of subdirs) {
      await traverse(dir.path, domain);
    }
  }
  
  const domains = await getAvailableDomains();
  
  for (const domain of domains) {
    await traverse(`domains/${domain}`, domain);
  }
  
  return ruleSets;
}

module.exports = {
  fetchDirectoryContents,
  fetchFileContent,
  hasRulesFile,
  getAvailableDomains,
  getAvailableSubdirectories,
  checkDirectRules,
  discoverAllRuleSets
};
