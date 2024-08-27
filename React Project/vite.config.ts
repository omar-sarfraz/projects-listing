import { sentryVitePlugin } from "@sentry/vite-plugin";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "tailwindcss";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react(), sentryVitePlugin({
        org: "arbisoft-m1",
        project: "project-listings-frontend"
    })],

    css: {
        postcss: {
            plugins: [tailwindcss()],
        },
    },

    optimizeDeps: {
        exclude: ["js-big-decimal"],
    },

    build: {
        sourcemap: true
    }
});