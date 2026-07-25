import { test } from "node:test";
import assert from "node:assert/strict";
import { UnknownToolError } from "../src/errors.js";

test("UnknownToolError is an Error subclass", () => {
  const error = new UnknownToolError("No tool registered as 'flee'");
  assert.ok(error instanceof Error);
  assert.equal(error.name, "UnknownToolError");
  assert.equal(error.message, "No tool registered as 'flee'");
});
