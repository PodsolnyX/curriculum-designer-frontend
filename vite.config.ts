import { defineConfig, ProxyOptions } from 'vite';
import react from '@vitejs/plugin-react-swc';
import tsconfigPaths from 'vite-tsconfig-paths';
import svgr from 'vite-plugin-svgr';
import mkcert from 'vite-plugin-mkcert';
import ImportMetaEnvPlugin from '@import-meta-env/unplugin';

const proxyTarget = process.env.BACKEND_URI ?? 'https://localhost:42360';
const frontendPort = Number.parseInt(process.env.PORT ?? '5173');

const proxyOptions: ProxyOptions = {
  target: proxyTarget,
  secure: false,
  changeOrigin: true,
};

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    mkcert(),
    ImportMetaEnvPlugin.vite({
      example: '.env.example',
      env: '.env',
    }),
    react(),
    tsconfigPaths(),
    svgr({ include: '**/*.svg?react', svgrOptions: { icon: true } }),
  ],
  server: {
    port: frontendPort as number,
    https: {},
    proxy: {
      '/api': {
        ...proxyOptions,
        ws: true,
      },
      '/swagger': proxyOptions,
    },
  },
  preview: {
    port: frontendPort,
  },
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler',
      },
    },
  },
});
