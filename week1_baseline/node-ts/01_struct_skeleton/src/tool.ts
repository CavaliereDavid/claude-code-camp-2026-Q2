export interface ToolParameter {
  type: string;
  description: string;
}

export interface Tool {
  name: string;
  description: string;
  parameters: Record<string, ToolParameter>;
  block: (...args: unknown[]) => string;
}

export function toolToString(tool: Tool): string {
  return `#<Tool name=${tool.name} description=${tool.description.slice(0, 41)} params=${Object.keys(tool.parameters).join(",")}>`;
}
