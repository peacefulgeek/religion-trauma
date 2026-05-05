import { build } from 'esbuild';

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
    'react-router-dom'
  ],
  banner: {
    js: `import { createRequire } from 'module';\nconst require = createRequire(import.meta.url);`
  },
  minify: false,
  sourcemap: true,
  logLevel: 'info'
});

console.log('[build-server] dist/index.js built');
