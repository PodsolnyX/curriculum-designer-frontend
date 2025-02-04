import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tsconfigPaths from "vite-tsconfig-paths";
import svgr from "vite-plugin-svgr";
import ImportMetaEnvPlugin from "@import-meta-env/unplugin";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
      ImportMetaEnvPlugin.vite({
        example: '.env.example',
        env: '.env',
      }),
      react(),
      tsconfigPaths(),
      svgr({include: "**/*.svg?react", svgrOptions: { icon: true } })
  ],
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler'
      }
    }
  }
})
