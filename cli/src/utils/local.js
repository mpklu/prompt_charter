const fs = require('fs');
const path = require('path');

// For local testing - assumes CLI is run from within the repo
const REPO_ROOT = path.join(__dirname, '../../../');

/**
 * Read directory contents from local filesystem
 * @param {string} dirPath - Path relative to repo root
 * @returns {Array} Array of file/directory objects
 */
function readLocalDirectory(dirPath) {
  const fullPath = path.join(REPO_ROOT, dirPath);
  
  if (!fs.existsSync(fullPath)) {
    return [];
  }
  
  const items = fs.readdirSync(fullPath, { withFileTypes: true });
  
  return items.map(item => ({
    name: item.name,
    type: item.isDirectory() ? 'dir' : 'file',
    path: path.join(dirPath, item.name)
  }));
}

/**
 * Read file content from local filesystem
 * @param {string} filePath - Path relative to repo root
 * @returns {string} File content
 */
function readLocalFile(filePath) {
  const fullPath = path.join(REPO_ROOT, filePath);
  return fs.readFileSync(fullPath, 'utf8');
}

/**
 * Recursively check if a path contains RULES.md locally
 * @param {string} dirPath - Directory path to check
 * @returns {boolean}
 */
function hasRulesFileLocal(dirPath) {
  try {
    const contents = readLocalDirectory(dirPath);
    
    // Check if RULES.md exists in current directory
    const hasRules = contents.some(item => 
      item.type === 'file' && item.name === 'RULES.md'
    );
    
    if (hasRules) return true;
    
    // Check subdirectories
    const subdirs = contents.filter(item => item.type === 'dir');
    
    for (const dir of subdirs) {
      if (hasRulesFileLocal(dir.path)) return true;
    }
    
    return false;
  } catch (error) {
    return false;
  }
}

/**
 * Get all domain directories that contain RULES.md files (local)
 * @returns {Array<string>}
 */
function getAvailableDomainsLocal() {
  const contents = readLocalDirectory('domains');
  const domains = contents.filter(item => item.type === 'dir');
  
  const availableDomains = [];
  
  for (const domain of domains) {
    if (hasRulesFileLocal(domain.path)) {
      availableDomains.push(domain.name);
    }
  }
  
  return availableDomains;
}

/**
 * Get subdirectories under a path that contain RULES.md (local)
 * @param {string} dirPath - Path to check
 * @returns {Array<{name: string, hasDirectRules: boolean}>}
 */
function getAvailableSubdirectoriesLocal(dirPath) {
  const contents = readLocalDirectory(dirPath);
  
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
    if (hasRulesFileLocal(dir.path)) {
      const dirHasDirectRules = checkDirectRulesLocal(dir.path);
      available.push({
        name: dir.name,
        hasDirectRules: dirHasDirectRules
      });
    }
  }
  
  return available;
}

/**
 * Check if a directory directly contains RULES.md (local)
 * @param {string} dirPath
 * @returns {boolean}
 */
function checkDirectRulesLocal(dirPath) {
  const contents = readLocalDirectory(dirPath);
  return contents.some(item => 
    item.type === 'file' && item.name === 'RULES.md'
  );
}

/**
 * Discover all available rule sets locally
 * @returns {Array<{domain: string, path: string, fullPath: string}>}
 */
function discoverAllRuleSetsLocal() {
  const ruleSets = [];
  
  function traverse(basePath, domain) {
    const contents = readLocalDirectory(basePath);
    
    // Check if RULES.md exists here
    const rulesFile = contents.find(item => 
      item.type === 'file' && item.name === 'RULES.md'
    );
    
    if (rulesFile) {
      ruleSets.push({
        domain,
        path: basePath.replace('domains/', ''),
        fullPath: path.join(basePath, 'RULES.md')
      });
      return;
    }
    
    // Traverse subdirectories
    const subdirs = contents.filter(item => item.type === 'dir');
    for (const dir of subdirs) {
      traverse(dir.path, domain);
    }
  }
  
  const domains = getAvailableDomainsLocal();
  
  for (const domain of domains) {
    traverse(`domains/${domain}`, domain);
  }
  
  return ruleSets;
}

module.exports = {
  readLocalDirectory,
  readLocalFile,
  hasRulesFileLocal,
  getAvailableDomainsLocal,
  getAvailableSubdirectoriesLocal,
  checkDirectRulesLocal,
  discoverAllRuleSetsLocal
};
