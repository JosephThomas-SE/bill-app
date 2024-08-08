const { execSync } = require('child_process');
const filePath = '.env'; // File to remove

// Use double quotes for Windows compatibility
execSync(`git filter-branch --force --index-filter "git rm --cached --ignore-unmatch ${filePath}" --prune-empty --tag-name-filter cat -- --all`, { stdio: 'inherit' });

// Clean up the repository
execSync('rm -rf .git/refs/original/', { stdio: 'inherit' });
execSync('git reflog expire --expire=now --all', { stdio: 'inherit' });
execSync('git gc --prune=now', { stdio: 'inherit' });
execSync('git gc --aggressive --prune=now', { stdio: 'inherit' });

// Force push the changes
execSync('git push origin --force --all', { stdio: 'inherit' });

console.log(`${filePath} has been removed from the repository history.`);
