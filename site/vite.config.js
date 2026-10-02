import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { viteSingleFile } from 'vite-plugin-singlefile'

// `npm run build` makes a normal site in dist/.
// `npm run build:preview` makes one self-contained HTML file for the Claude preview link.
export default defineConfig(({ mode }) => ({
  plugins: mode === 'preview' ? [react(), viteSingleFile()] : [react()],
  base: './',
  build: mode === 'preview' ? { outDir: 'dist-preview' } : {},
}))
