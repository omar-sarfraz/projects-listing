import { sentryVitePlugin } from "@sentry/vite-plugin";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "tailwindcss";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        react(),
        VitePWA({
            injectRegister: "auto",
            workbox: {
                runtimeCaching: [
                    {
                        urlPattern: ({ url }) => {
                            return url.pathname.startsWith("/");
                        },
                        handler: "NetworkFirst" as const,
                        options: {
                            cacheName: "cache",
                            cacheableResponse: {
                                statuses: [0, 200],
                            },
                        },
                    },
                ],
            },
            includeAssets: ["**/*.{png}", "favicon.ico", "favicon.svg"],
            manifest: false,
        }),
        sentryVitePlugin({
            org: "arbisoft-m1",
            project: "project-listings-frontend",
        }),
    ],

    css: {
        postcss: {
            plugins: [tailwindcss()],
        },
    },

    optimizeDeps: {
        exclude: ["js-big-decimal"],
    },

    build: {
        sourcemap: true,
    },

    define: {
        APP_VERSION: JSON.stringify(process.env.npm_package_version),
    },
});
