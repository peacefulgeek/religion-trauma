import { build } from 'esbuild';
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

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
    'pg',
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
console.log('[build-server] dist/index.js built');
