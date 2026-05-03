import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite'
import flowbiteReact from "flowbite-react/plugin/vite";
import path from "path";
import {VitePWA} from "vite-plugin-pwa";

const backendProxyTarget = process.env.VITE_BACKEND_PROXY_TARGET || "http://localhost:5000";

export default defineConfig({
    plugins: [
        react(),
        tailwindcss(),
        flowbiteReact(),
        VitePWA({
            registerType: "autoUpdate",
            injectRegister: "auto",
            manifest: {
                name: "eleonore",
                short_name: "eleonore",
                description: "E-learning aplikácia",
                start_url: "/",
                scope: "/",
                display: "standalone",
                theme_color: "#050505",
                background_color: "#050505",
                icons: [
                    {
                        src: "/pwa-192x192.png",
                        sizes: "192x192",
                        type: "image/png",
                    },
                    {
                        src: "/pwa-512x512.png",
                        sizes: "512x512",
                        type: "image/png",
                    },
                    {
                        src: "/pwa-512x512-maskable.png",
                        sizes: "512x512",
                        type: "image/png",
                        purpose: "maskable",
                    },
                ],
            },
            workbox: {
                globPatterns: [],
                navigateFallback: null,
                runtimeCaching: [
                    {
                        urlPattern: ({request}) => request.mode === "navigate",
                        handler: "NetworkOnly",
                    },
                    {
                        urlPattern: ({url}) => url.pathname.startsWith("/api/"),
                        handler: "NetworkOnly",
                    },
                ],
            },
        }),
    ],
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
