/// <reference types="vitest/config" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig({
    server: {
        host: "::",
        port: 8080,
    },
    plugins: [react()],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
    build: {
        rollupOptions: {
            output: {
                manualChunks: {
                    firebase: ["firebase/app", "firebase/firestore", "firebase/analytics"],
                    vendor: ["react", "react-dom", "react-router-dom"],
                },
            },
        },
    },
    test: {
        environment: "node",
        include: ["src/**/*.test.ts"],
    },
});
