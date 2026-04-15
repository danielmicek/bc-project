import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite'
import flowbiteReact from "flowbite-react/plugin/vite";
import path from "path";

const backendProxyTarget = process.env.VITE_BACKEND_PROXY_TARGET || "http://localhost:5000";

export default defineConfig({
    plugins: [react(), tailwindcss(), flowbiteReact()],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
    test: {
        environment: "jsdom",
        setupFiles: "./src/test/setup.js",
        globals: true,
    },
    server: {
        port: 5173,
        proxy: {
            "/api": {
                target: backendProxyTarget,
                changeOrigin: true,
            },
        },
    },
    root: '.', // Optional: Defaults to the current directory
});
