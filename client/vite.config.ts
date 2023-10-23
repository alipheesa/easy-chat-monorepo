import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import viteTsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  base: "",
  plugins: [react(), viteTsconfigPaths()],
  server: {
    host: true,
    port: 3000
  },
  envDir: "./env_files",
  envPrefix: "VITE_",
});
