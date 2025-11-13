import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { readFileSync, writeFileSync, existsSync, mkdirSync, copyFileSync, readdirSync, lstatSync } from 'fs';

// Function to copy directories recursively
function copyDir(src, dest) {
  if (!existsSync(dest)) {
    mkdirSync(dest, { recursive: true });
  }

  const entries = readdirSync(src, { withFileTypes: true });
  
  for (const entry of entries) {
    const srcPath = resolve(src, entry.name);
    const destPath = resolve(dest, entry.name);
    
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      copyFileSync(srcPath, destPath);
    }
  }
}

// Function to ensure all static assets are copied
function copyStaticAssets() {
  const publicPath = resolve(__dirname, 'public');
  const distPath = resolve(__dirname, 'dist');
  
  // Copy all files from public to dist, except index.html
  const entries = readdirSync(publicPath, { withFileTypes: true });
  
  for (const entry of entries) {
    if (entry.name === 'index.html') continue;
    
    const src = resolve(publicPath, entry.name);
    const dest = resolve(distPath, entry.name);
    
    if (entry.isDirectory()) {
      copyDir(src, dest);
    } else {
      copyFileSync(src, dest);
    }
  }
  
  // Ensure photo-data.json is in the right place
  const photoDataPath = resolve(__dirname, 'public/components/photo-data.json');
  const distComponentsPath = resolve(__dirname, 'dist/components');
  
  if (existsSync(photoDataPath)) {
    if (!existsSync(distComponentsPath)) {
      mkdirSync(distComponentsPath, { recursive: true });
    }
    
    const photoData = JSON.parse(readFileSync(photoDataPath, 'utf-8'));
    writeFileSync(
      resolve(distComponentsPath, 'photo-data.json'),
      JSON.stringify(photoData, null, 2)
    );
  }
}

export default defineConfig({
  base: '/',
  plugins: [
    react(),
    {
      name: 'copy-assets',
      closeBundle() {
        copyStaticAssets();
      }
    }
  ],
  publicDir: 'public',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html')
      },
      output: {
        assetFileNames: 'assets/[name].[hash][extname]',
        chunkFileNames: 'assets/[name].[hash].js',
        entryFileNames: 'assets/[name].[hash].js'
      }
    }
  },
  server: {
    port: 3000,
    strictPort: true
  }
})
