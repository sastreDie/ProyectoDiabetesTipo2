// frontend/vite.config.js

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
    plugins: [react()],
    server: {
        // --- ESTA ES LA MAGIA ---
        // Redirige cualquier llamada a '/submit' hacia tu backend de Python
        proxy: {
            '/submit': {
                target: 'http://localhost:8000',
                changeOrigin: true,
            }
        }
    }
})