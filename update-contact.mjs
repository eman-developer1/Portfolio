import fs from 'fs';
import path from 'path';

const searchReplaceList = [
  // Email
  { search: /contact\.emankhan@example\.com/g, replace: 'emanaslam182@gmail.com' },
  { search: /contact\.emanalsam182@gmail\.com/g, replace: 'emanaslam182@gmail.com' },
  // GitHub
  { search: /https:\/\/github\.com\/emankhan-dev/g, replace: 'https://github.com/eman-developer1' },
  // LinkedIn
  { search: /https:\/\/linkedin\.com\/in\/eman-khan-dev/g, replace: 'https://www.linkedin.com/in/eman-khan-a5582b334/' },
  { search: /linkedin\.com\/in\/eman-khan-dev/g, replace: 'linkedin.com/in/eman-khan-a5582b334' },
  // Phone / WhatsApp
  { search: /\+1 \(234\) 567-890/g, replace: '+92 3298386594' },
];

function processDirectory(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    if (file === 'node_modules' || file === '.next' || file === '.git') continue;
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      processDirectory(fullPath);
    } else if (fullPath.endsWith('.ts') || fullPath.endsWith('.tsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let changed = false;
      for (const rule of searchReplaceList) {
        if (rule.search.test(content)) {
          content = content.replace(rule.search, rule.replace);
          changed = true;
        }
      }
      // Specific fix for the rawWhatsapp fallback
      if (content.includes("replace(/[^\\d+]/g, '') : '1234567890'")) {
        content = content.replace("replace(/[^\\d+]/g, '') : '1234567890'", "replace(/[^\\d+]/g, '') : '3298386594'");
        changed = true;
      }
      if (changed) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`Updated: ${fullPath}`);
      }
    }
  }
}

processDirectory('.');
