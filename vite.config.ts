import dts from "vite-plugin-dts";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [
    dts({
      entryRoot: "./src",
      tsconfigPath: "tsconfig.app.json",
    }),
  ],

  build: {
    ssr: true,
    emptyOutDir: true,
    reportCompressedSize: true,

    target: "es2023",
    modulePreload: {
      polyfill: false,
    },
    commonjsOptions: {
      transformMixedEsModules: true,
    },

    lib: {
      entry: {
        plugin: "src/plugin.ts",
      },
      formats: ["es", "cjs"],
    },
  },

  test: {
    environment: "node",
    globals: true,
    include: ["src/**/*.test.ts"],
    coverage: {
      thresholds: {
        autoUpdate: true,
        functions: 100,
        lines: 100,
        statements: 100,
        branches: 81.81,
      },
      provider: "v8",
      reporter: ["text", "json", "html"],
      exclude: [
        "node_modules/**",
        "dist/**",
        "vite.config.ts",
        "release.config.js",
      ],
    },
  },
});
