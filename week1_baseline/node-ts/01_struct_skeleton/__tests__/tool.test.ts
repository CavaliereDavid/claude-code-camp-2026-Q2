import { test } from "node:test";
import assert from "node:assert/strict";
import { toolToString, type Tool } from "../src/tool.js";

function makeTool(overrides: Partial<Tool> = {}): Tool {
  return {
    name: "move",
    description: "Move the player in a direction (north, south, east, west, up, down)",
    parameters: { direction: { type: "string", description: "The direction to move" } },
    block: (direction) => `You move ${direction}.`,
    ...overrides,
  };
}

test("toolToString includes the tool name", () => {
  assert.match(toolToString(makeTool()), /name=move/);
});

test("toolToString truncates description to 41 characters", () => {
  const description = "x".repeat(100);
  const result = toolToString(makeTool({ description }));
  assert.match(result, new RegExp(`description=${"x".repeat(41)} `));
});

test("toolToString lists parameter keys", () => {
  const parameters = {
    direction: { type: "string", description: "..." },
    target: { type: "string", description: "..." },
  };
  const result = toolToString(makeTool({ parameters }));
  assert.match(result, /params=direction,target/);
});

test("toolToString shows an empty params list when there are no parameters", () => {
  const result = toolToString(makeTool({ parameters: {} }));
  assert.match(result, /params=>$/);
});
