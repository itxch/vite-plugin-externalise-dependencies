import { UserConfig } from "vite";
import { readFileSync } from "node:fs";

/**
 * Configuration options for the externaliseDependencies plugin
 */
type ExternaliseDependenciesOptions = {
  /**
   * Custom path to package.json file
   * @default "{root}/package.json" where root is the Vite project root or current working directory
   */
  packageJsonPath?: string;
};

/**
 * Creates a Vite plugin that externalizes all packages listed in the dependencies field of package.json
 * @param {ExternaliseDependenciesOptions} options - Configuration options
 * @param {string} options.packageJsonPath - Custom path to package.json file. Defaults to "{root}/package.json"
 * where root is the Vite project root or current working directory
 */
const externaliseDependencies = (options?: ExternaliseDependenciesOptions) => {
  return {
    name: "externalise-dependencies",
    config: async ({ root }: UserConfig): Promise<UserConfig | null | void> => {
      const { packageJsonPath } = options || {};

      const rootDir = root || process.cwd();
      const pkgJsonPath = packageJsonPath || `${rootDir}/package.json`;

      let packageJsonContent: string;
      try {
        packageJsonContent = readFileSync(pkgJsonPath, "utf-8");
      } catch (error) {
        console.error(error);
        throw new Error(`Could not find package.json at ${pkgJsonPath}`);
      }

      let packageJsonData: { dependencies?: {} };
      try {
        packageJsonData = JSON.parse(packageJsonContent);
      } catch (error) {
        console.error(error);
        throw new Error(`Could not parse package.json at ${pkgJsonPath}`);
      }

      if (!packageJsonData.dependencies) {
        throw new Error(
          `Dependencies field not found in package.json at ${pkgJsonPath}`,
        );
      }

      const deps = Object.keys(packageJsonData.dependencies);

      return {
        build: {
          rollupOptions: {
            external: [...deps],
          },
        },
      };
    },
  };
};

export default externaliseDependencies;

externaliseDependencies();
