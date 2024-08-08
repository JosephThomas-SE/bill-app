const { execSync } = require('child_process');
const filePath = '.env'; // File to remove

// Remove the file from history
execSync(`git filter-branch --force --index-filter 'git rm --cached --ignore-unmatch ${filePath}' --prune-empty --tag-name-filter cat -- --all`);

// Clean up the repository
execSync('rm -rf .git/refs/original/');
execSync('git reflog expire --expire=now --all');
execSync('git gc --prune=now');
execSync('git gc --aggressive --prune=now');

// Force push the changes
execSync('git push origin --force --all');

console.log(`${filePath} has been removed from the repository history.`);
