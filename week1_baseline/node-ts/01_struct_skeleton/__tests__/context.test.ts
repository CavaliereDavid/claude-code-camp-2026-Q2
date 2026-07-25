import { test } from "node:test";
import assert from "node:assert/strict";
import {
  createContext,
  registerTool,
  addMessage,
  toolCount,
  turnCount,
  contextToString,
} from "../src/context.js";
import type { Tool } from "../src/tool.js";

function makeTool(name: string): Tool {
  return {
    name,
    description: "a tool",
    parameters: {},
    block: () => "",
  };
}

test("createContext starts with no messages or tools", () => {
  const ctx = createContext({ task: "player" });
  assert.deepEqual(ctx.messages, []);
  assert.deepEqual(ctx.tools, {});
  assert.equal(ctx.system, undefined);
});

test("registerTool adds a tool keyed by name", () => {
  const ctx = createContext({ task: "player" });
  registerTool(ctx, makeTool("move"));
  assert.equal(toolCount(ctx), 1);
  assert.equal(ctx.tools["move"]?.name, "move");
});

test("registerTool overwrites a tool registered under the same name", () => {
  const ctx = createContext({ task: "player" });
  registerTool(ctx, makeTool("move"));
  registerTool(ctx, makeTool("move"));
  assert.equal(toolCount(ctx), 1);
});

test("addMessage appends messages in order", () => {
  const ctx = createContext({ task: "player" });
  addMessage(ctx, "user", "hello");
  addMessage(ctx, "assistant", "hi there");
  assert.equal(turnCount(ctx), 2);
  assert.equal(ctx.messages[0]?.role, "user");
  assert.equal(ctx.messages[1]?.role, "assistant");
});

test("addMessage stores toolUseId when provided", () => {
  const ctx = createContext({ task: "player" });
  addMessage(ctx, "tool_result", "you see a corridor", "toolu_01X");
  assert.equal(ctx.messages[0]?.toolUseId, "toolu_01X");
});

test("contextToString formats task, turns, and tools", () => {
  const ctx = createContext({ task: "player" });
  registerTool(ctx, makeTool("move"));
  addMessage(ctx, "user", "hello");
  assert.equal(contextToString(ctx), "#<Context task=player turns=1 tools=1>");
});
