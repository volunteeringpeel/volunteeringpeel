const fs = require('fs');

// relocate default config
fs.writeFileSync(
  'node_modules/semantic-ui-less/theme.config',
  "@import '../../src/app/css/semantic/theme.config';\n",
  'utf8'
);

function fixFontPath(filename) {
  const content = fs.readFileSync(filename, 'utf8');
  const newContent = content.replace(
    "@fontPath  : '../../themes/",
    "@fontPath  : '../../../themes/"
  );
  fs.writeFileSync(filename, newContent, 'utf8');
}

// fix well known bug with default distribution
fixFontPath('node_modules/semantic-ui-less/themes/default/globals/site.variables');
fixFontPath('node_modules/semantic-ui-less/themes/flat/globals/site.variables');
fixFontPath('node_modules/semantic-ui-less/themes/material/globals/site.variables');
