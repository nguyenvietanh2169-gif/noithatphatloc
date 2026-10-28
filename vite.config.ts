import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
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
