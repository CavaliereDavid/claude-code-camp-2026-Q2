import fs from "node:fs";
import path from "node:path";

export interface PromptOptions {
  userPromptsDir?: string;
  defaultPromptsDir?: string;
}

export function provider(taskName: string, settings: Record<string, unknown>): string {
  const value = settings["provider"] as string | undefined;
  if (value == null) {
    throw new Error(`tasks.${taskName}.provider is required in settings.yml`);
  }
  return value;
}

export function model(taskName: string, settings: Record<string, unknown>): string {
  const value = settings["model"] as string | undefined;
  if (value == null) {
    throw new Error(`tasks.${taskName}.model is required in settings.yml`);
  }
  return value;
}

export function promptOverride(settings: Record<string, unknown>, prompt = "system"): boolean {
  const node = settings["prompt_override"];
  if (typeof node !== "object" || node === null) return false;
  return (node as Record<string, unknown>)[prompt] === true;
}

export function prompt(
  taskName: string,
  settings: Record<string, unknown>,
  name = "system",
  opts: PromptOptions = {},
): string | undefined {
  if (promptOverride(settings, name)) {
    const text = readUserPrompt(taskName, name, opts.userPromptsDir);
    if (text !== undefined) return text;
  }
  return readDefaultPrompt(name, opts.defaultPromptsDir);
}

export function systemPrompt(
  taskName: string,
  settings: Record<string, unknown>,
  opts: PromptOptions = {},
): string | undefined {
  return prompt(taskName, settings, "system", opts);
}

function readUserPrompt(
  taskName: string,
  promptName: string,
  userPromptsDir?: string,
): string | undefined {
  if (!userPromptsDir) return undefined;
  return readFileTrimmed(path.join(userPromptsDir, taskName, `${promptName}.md`));
}

function readDefaultPrompt(
  promptName: string,
  defaultPromptsDir?: string,
): string | undefined {
  if (!defaultPromptsDir) return undefined;
  return readFileTrimmed(path.join(defaultPromptsDir, `${promptName}.md`));
}

function readFileTrimmed(filePath: string): string | undefined {
  return fs.existsSync(filePath) ? fs.readFileSync(filePath, "utf8").trim() : undefined;
}
