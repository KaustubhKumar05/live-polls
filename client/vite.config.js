import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import ts from "vite-plugin-ts";

export default defineConfig({
  plugins: [
    react(),
    ts({
      tsConfigFile: "tsconfig.json",
    }),
  ],
});
