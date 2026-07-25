import type { Context, Tool, ToolParameter } from "@boukensha/01_struct_skeleton";
import { registerTool } from "@boukensha/01_struct_skeleton";
import { UnknownToolError } from "./errors.js";

export interface Registry {
  context: Context;
}

export function createRegistry(context: Context): Registry {
  return { context };
}

export function defineTool(
  registry: Registry,
  name: string,
  options: { description: string; parameters?: Record<string, ToolParameter> },
  block: (args: Record<string, unknown>) => string,
): Tool {
  const tool: Tool = {
    name,
    description: options.description,
    parameters: options.parameters ?? {},
    block,
  };
  registerTool(registry.context, tool);
  return tool;
}

export function dispatch(
  registry: Registry,
  name: string,
  args: Record<string, unknown> = {},
): string {
  const tool = registry.context.tools[name];
  if (!tool) {
    throw new UnknownToolError(`No tool registered as '${name}'`);
  }
  return tool.block(args);
}
