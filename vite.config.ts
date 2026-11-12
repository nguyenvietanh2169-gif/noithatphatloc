import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import fs from 'node:fs';
import path from 'node:path';

// Plugin hỗ trợ Vite Dev Server tự động map URL thư mục sang file index.html tương ứng trong public/
function servePublicHtmlPlugin() {
  return {
    name: 'serve-public-html',
    configureServer(server: any) {
      server.middlewares.use((req: any, res: any, next: any) => {
        if (!req.url) return next();
        const urlPath = req.url.split('?')[0];
        if (urlPath === '/' || urlPath === '/index.html') return next();

        // Kiểm tra xem có file public/<path>/index.html hay không
        const cleanPath = urlPath.replace(/\/$/, '');
        const candidateFile = path.resolve(process.cwd(), 'public', cleanPath.replace(/^\//, ''), 'index.html');
        if (fs.existsSync(candidateFile)) {
          res.setHeader('Content-Type', 'text/html; charset=utf-8');
          res.end(fs.readFileSync(candidateFile, 'utf-8'));
          return;
        }
        next();
      });
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    servePublicHtmlPlugin(),
    react(),
    tailwindcss(),
  ],
  build: {
    // Tắt hoàn toàn source maps - ngăn tuyệt đối người khác xem file code gốc .ts/.tsx trên trình duyệt
    sourcemap: false,
    minify: 'esbuild',
    chunkSizeWarningLimit: 1000,
  },
  esbuild: {
    // Xóa sạch console.log và debugger khi đóng gói sản phẩm
    drop: ['console', 'debugger'],
    legalComments: 'none',
  },
  server: {
    host: true,
    port: 3000,
  },
});
