import * as base from "./base.js";

export const TASK_NAME = "player";

export const provider = (settings: Record<string, unknown>): string =>
  base.provider(TASK_NAME, settings);

export const model = (settings: Record<string, unknown>): string =>
  base.model(TASK_NAME, settings);

export const promptOverride = (settings: Record<string, unknown>, prompt = "system"): boolean =>
  base.promptOverride(settings, prompt);

export const prompt = (
  settings: Record<string, unknown>,
  name = "system",
  opts?: base.PromptOptions,
): string | undefined => base.prompt(TASK_NAME, settings, name, opts);

export const systemPrompt = (
  settings: Record<string, unknown>,
  opts?: base.PromptOptions,
): string | undefined => base.systemPrompt(TASK_NAME, settings, opts);
