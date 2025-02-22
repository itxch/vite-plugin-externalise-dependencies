import { UserConfig } from "vite";
import { join } from "node:path";
import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import externaliseDependencies from "./plugin";

describe("externaliseDependencies plugin", () => {
  const testDir = join(__dirname, "__test-temp");
  const validPackageJson = {
    dependencies: {
      react: "^17.0.0",
      lodash: "^4.17.0",
    },
  };

  beforeEach(() => {
    mkdirSync(testDir, { recursive: true });
  });

  afterEach(() => {
    rmSync(testDir, { recursive: true, force: true });
  });

  it("should externalize dependencies from package.json", async () => {
    const pkgPath = join(testDir, "package.json");
    writeFileSync(pkgPath, JSON.stringify(validPackageJson));

    const plugin = externaliseDependencies({ packageJsonPath: pkgPath });
    const config = await plugin.config({ root: testDir } as UserConfig);

    expect(config).toEqual({
      build: {
        rollupOptions: {
          external: ["react", "lodash"],
        },
      },
    });
  });

  it("should throw error when package.json is not found", async () => {
    const nonExistentPath = join(testDir, "non-existent-package.json");
    const plugin = externaliseDependencies({
      packageJsonPath: nonExistentPath,
    });

    await expect(
      plugin.config({ root: testDir } as UserConfig),
    ).rejects.toThrow(`Could not find package.json at ${nonExistentPath}`);
  });

  it("should throw error when package.json is invalid JSON", async () => {
    const pkgPath = join(testDir, "package.json");
    writeFileSync(pkgPath, "invalid json content");

    const plugin = externaliseDependencies({ packageJsonPath: pkgPath });

    await expect(
      plugin.config({ root: testDir } as UserConfig),
    ).rejects.toThrow(`Could not parse package.json at ${pkgPath}`);
  });

  it("should throw error when dependencies field is missing", async () => {
    const pkgPath = join(testDir, "package.json");
    writeFileSync(pkgPath, JSON.stringify({}));

    const plugin = externaliseDependencies({ packageJsonPath: pkgPath });

    await expect(
      plugin.config({ root: testDir } as UserConfig),
    ).rejects.toThrow(
      `Dependencies field not found in package.json at ${pkgPath}`,
    );
  });

  it("should use process.cwd() when root is not provided", async () => {
    const pkgPath = join(testDir, "package.json");
    writeFileSync(pkgPath, JSON.stringify(validPackageJson));

    const plugin = externaliseDependencies({ packageJsonPath: pkgPath });
    const config = await plugin.config({} as UserConfig);

    expect(config).toEqual({
      build: {
        rollupOptions: {
          external: ["react", "lodash"],
        },
      },
    });
  });
});
