# vite-plugin-externalise-dependencies

A Vite plugin that automatically externalizes all packages listed in the `dependencies` field of your `package.json` file.
Useful for building libraries that should not bundle their dependencies such as server side / node packages.

## Installation

```bash
npm install @itxch/vite-plugin-externalise-dependencies --save-dev
```

## Usage

Add the plugin to your `vite.config.ts`:

```typescript
import { defineConfig } from "vite";
import externaliseDependencies from "@itxch/vite-plugin-externalise-dependencies";

export default defineConfig({
  plugins: [externaliseDependencies()],
});
```

## How It Works

The plugin reads your project's `package.json` file and automatically adds all packages listed in the `dependencies` field to Vite's external configuration. This is useful when:

- Building libraries that should not bundle their dependencies
- Creating packages that rely on peer dependencies
- Reducing bundle size by excluding dependencies

## Options

| Option            | Type     | Default               | Description                           |
| ----------------- | -------- | --------------------- | ------------------------------------- |
| `packageJsonPath` | `string` | `{root}/package.json` | Custom path to your package.json file |

## Requirements

- Node.js >= 22
- Vite >= 5

## License

MIT
