import { build } from 'esbuild';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');

// Post-build patch: fix react-router-dom/server bare import that Node ESM can't resolve
// Note: react-dom/server is fine as-is (it uses package exports correctly)
function patchImports(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  // Fix react-router-dom/server → react-router-dom/server.js
  content = content.replace(
    /from\s+["']react-router-dom\/server["']/g,
    'from "react-router-dom/server.js"'
  );
  content = content.replace(
    /import\s+["']react-router-dom\/server["']/g,
    'import "react-router-dom/server.js"'
  );
  fs.writeFileSync(filePath, content);
}

// Step 1: Build SSR entry (React server render)
console.log('[build-server] Building SSR entry...');
await build({
  entryPoints: ['src/client/entry-server.tsx'],
  bundle: true,
  platform: 'node',
  format: 'esm',
  target: 'node20',
  outfile: 'dist/server/entry-server.js',
  external: [
    'react',
    'react-dom',
    'react-dom/server',
    'react-router-dom',
    'react-router-dom/server',
    'react-helmet-async',
  ],
  jsx: 'automatic',
  minify: false,
  sourcemap: false,
  logLevel: 'info',
});
patchImports('dist/server/entry-server.js');
console.log('[build-server] dist/server/entry-server.js built');

// Step 2: Build Express server
console.log('[build-server] Building Express server...');
await build({
  entryPoints: ['server/index.ts'],
  bundle: true,
  platform: 'node',
  format: 'esm',
  target: 'node20',
  outfile: 'dist/index.js',
  external: [
    'vite',
    '@vitejs/plugin-react',
    'express',
    'compression',
    'serve-static',
    'node-cron',
    'openai',
    'sharp',
    'nodemailer',
    'react',
    'react-dom',
    'react-dom/server',
    'react-router-dom',
    'react-router-dom/server',
    'react-helmet-async',
  ],
  banner: {
    js: `import { createRequire } from 'module';\nconst require = createRequire(import.meta.url);`,
  },
  minify: false,
  sourcemap: true,
  logLevel: 'info',
});
patchImports('dist/index.js');
console.log('[build-server] dist/index.js built');
