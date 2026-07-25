import { test } from "node:test";
import assert from "node:assert/strict";
import { createContext } from "@boukensha/01_struct_skeleton";
import { createRegistry, defineTool, dispatch } from "../src/registry.js";
import { UnknownToolError } from "../src/errors.js";

test("defineTool registers the tool onto the underlying context", () => {
  const registry = createRegistry(createContext({ task: "player" }));
  defineTool(registry, "move", { description: "Move" }, ({ direction }) => `moved ${direction}`);
  assert.equal(registry.context.tools["move"]?.name, "move");
});

test("dispatch invokes the tool's block and returns its result", () => {
  const registry = createRegistry(createContext({ task: "player" }));
  defineTool(
    registry,
    "shout",
    { description: "Shout" },
    ({ message }) => (message as string).toUpperCase(),
  );
  assert.equal(dispatch(registry, "shout", { message: "dragon spotted" }), "DRAGON SPOTTED");
});

test("dispatch throws UnknownToolError for an unregistered name", () => {
  const registry = createRegistry(createContext({ task: "player" }));
  assert.throws(
    () => dispatch(registry, "flee"),
    (error: unknown) => error instanceof UnknownToolError && error.message === "No tool registered as 'flee'",
  );
});

test("dispatch defaults args to {} for a zero-parameter tool", () => {
  const registry = createRegistry(createContext({ task: "player" }));
  defineTool(registry, "ping", { description: "Ping" }, () => "pong");
  assert.equal(dispatch(registry, "ping"), "pong");
});
