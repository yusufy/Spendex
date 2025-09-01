/*
  Strip comments from JS/TS/JSX/TSX files under backend/ and mobile/.
  - Removes // line comments and /* block comments *\/ while preserving strings.
  - Skips node_modules, build artifacts and fonts/images.
*/
const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const TARGET_DIRS = ['backend', 'mobile'];
const VALID_EXTS = new Set(['.js', '.jsx', '.ts', '.tsx']);

const IGNORE_DIRS = new Set([
  'node_modules', 'build', 'dist', '.expo', '.expo-shared', '.git', 'android', 'ios', 'web-build'
]);

/** Simple comment stripper using state machine. */
function stripComments(code) {
  let result = '';
  let i = 0;
  const len = code.length;
  let inSingle = false; // '
  let inDouble = false; // "
  let inTemplate = false; // `
  let inBlock = false; // /* */
  let inLine = false; // //
  while (i < len) {
    const char = code[i];
    const next = code[i + 1];
    if (inLine) {
      if (char === '\n') { inLine = false; result += char; }
      i++; continue;
    }
    if (inBlock) {
      if (char === '*' && next === '/') { inBlock = false; i += 2; continue; }
      i++; continue;
    }
    if (!inSingle && !inDouble && !inTemplate) {
      if (char === '/' && next === '/') { inLine = true; i += 2; continue; }
      if (char === '/' && next === '*') { inBlock = true; i += 2; continue; }
      if (char === '\'' ) { inSingle = true; result += char; i++; continue; }
      if (char === '"') { inDouble = true; result += char; i++; continue; }
      if (char === '`') { inTemplate = true; result += char; i++; continue; }
      result += char; i++; continue;
    }
    // Inside string/template
    if (inSingle) {
      if (char === '\\') { result += char + (next ?? ''); i += 2; continue; }
      if (char === '\'') { inSingle = false; }
      result += char; i++; continue;
    }
    if (inDouble) {
      if (char === '\\') { result += char + (next ?? ''); i += 2; continue; }
      if (char === '"') { inDouble = false; }
      result += char; i++; continue;
    }
    if (inTemplate) {
      if (char === '\\') { result += char + (next ?? ''); i += 2; continue; }
      if (char === '`') { inTemplate = false; }
      result += char; i++; continue;
    }
  }
  return result;
}

function shouldIgnore(filePath) {
  const rel = path.relative(ROOT, filePath);
  if (!rel) return true;
  const parts = rel.split(path.sep);
  return parts.some(p => IGNORE_DIRS.has(p));
}

function walk(dir, out = []) {
  if (shouldIgnore(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(full, out);
    } else if (VALID_EXTS.has(path.extname(entry.name))) {
      out.push(full);
    }
  }
  return out;
}

function main() {
  let files = [];
  for (const d of TARGET_DIRS) {
    const full = path.join(ROOT, d);
    if (fs.existsSync(full)) files = files.concat(walk(full));
  }
  console.log(`Stripping comments from ${files.length} files...`);
  for (const f of files) {
    const src = fs.readFileSync(f, 'utf8');
    const cleaned = stripComments(src);
    if (src !== cleaned) {
      fs.writeFileSync(f, cleaned, 'utf8');
      console.log('Updated', path.relative(ROOT, f));
    }
  }
}

main();


