import type { Message } from "./message.js";
import type { Tool } from "./tool.js";

export interface Context {
  task: string;
  system: string | undefined;
  messages: Message[];
  tools: Record<string, Tool>;
}

export function createContext(options: { task: string; system?: string }): Context {
  return { task: options.task, system: options.system, messages: [], tools: {} };
}

export function registerTool(context: Context, tool: Tool): void {
  context.tools[tool.name] = tool;
}

export function addMessage(
  context: Context,
  role: string,
  content: string,
  toolUseId?: string,
): void {
  const message: Message = toolUseId === undefined ? { role, content } : { role, content, toolUseId };
  context.messages.push(message);
}

export function toolCount(context: Context): number {
  return Object.keys(context.tools).length;
}

export function turnCount(context: Context): number {
  return context.messages.length;
}

export function contextToString(context: Context): string {
  return `#<Context task=${context.task} turns=${turnCount(context)} tools=${toolCount(context)}>`;
}
