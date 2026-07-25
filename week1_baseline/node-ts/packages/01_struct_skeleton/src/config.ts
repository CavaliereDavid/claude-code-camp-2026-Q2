import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parse } from "yaml";

const MODULE_DIR = path.dirname(fileURLToPath(import.meta.url));

// Default prompts shipped alongside the library code.
export const PROMPTS_DIR = path.join(MODULE_DIR, "..", "prompts");

// The .boukensha config directory is resolved in this order:
//   1. BOUKENSHA_DIR environment variable (set before loading .env)
//   2. ~/.boukensha  (default)
export const DEFAULT_DIR = path.join(os.homedir(), ".boukensha");

export interface Config {
  dir: string;
  settings: Record<string, unknown>;
}

export function loadConfig(): Config {
  const dir = resolveDir();
  loadEnv(dir);
  const settings = loadSettings(dir);
  return { dir, settings };
}

// With no name: returns the full tasks map from settings.yaml.
// With a name: returns that task's settings, or {} if it isn't configured.
export function tasks(config: Config, name?: string): Record<string, unknown> {
  const all = (dig(config.settings, "tasks") as Record<string, unknown> | undefined) ?? {};
  if (name === undefined) return all;
  return (all[name] as Record<string, unknown> | undefined) ?? {};
}

// The user's prompts directory for task prompt overrides.
export function userPromptsDir(config: Config): string {
  return path.join(config.dir, "prompts");
}

export function mudHost(config: Config): string {
  return (dig(config.settings, "mud", "host") as string | undefined) ?? "localhost";
}

export function mudPort(config: Config): number {
  return (dig(config.settings, "mud", "port") as number | undefined) ?? 4000;
}

export function mudUsername(config: Config): string | undefined {
  return dig(config.settings, "mud", "username") as string | undefined;
}

export function mudPassword(config: Config): string | undefined {
  return dig(config.settings, "mud", "password") as string | undefined;
}

// Fetch a nested key path from settings, e.g. dig(settings, "mud", "host").
export function dig(obj: unknown, ...keys: string[]): unknown {
  return keys.reduce<unknown>((node, key) => {
    if (typeof node === "object" && node !== null) {
      return (node as Record<string, unknown>)[key];
    }
    return undefined;
  }, obj);
}

export function configToString(config: Config): string {
  return `#<Config dir=${config.dir} tasks=${Object.keys(tasks(config)).join(",")}>`;
}

function resolveDir(): string {
  const raw = process.env.BOUKENSHA_DIR ?? DEFAULT_DIR;
  return path.resolve(raw);
}

// process.loadEnvFile throws ENOENT if the file doesn't exist, unlike Ruby's
// Dotenv.load which is a silent no-op — guard it explicitly.
function loadEnv(dir: string): void {
  const envFile = path.join(dir, ".env");
  if (fs.existsSync(envFile)) {
    process.loadEnvFile(envFile);
  }
}

function loadSettings(dir: string): Record<string, unknown> {
  const settingsFile = path.join(dir, "settings.yaml");
  if (fs.existsSync(settingsFile)) {
    return (parse(fs.readFileSync(settingsFile, "utf8")) as Record<string, unknown> | null) ?? {};
  }
  return {};
}
