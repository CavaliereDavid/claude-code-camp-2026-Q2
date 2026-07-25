import { test } from "node:test";
import assert from "node:assert/strict";
import { messageToString } from "../src/message.js";

test("messageToString omits the id tag when toolUseId is absent", () => {
  const result = messageToString({ role: "user", content: "hello" });
  assert.equal(result, "#<Message role=user content=hello...>");
});

test("messageToString includes the id tag when toolUseId is present", () => {
  const result = messageToString({ role: "tool_result", content: "you see a corridor", toolUseId: "toolu_01X" });
  assert.equal(result, "#<Message role=tool_result [toolu_01X] content=you see a corridor...>");
});

test("messageToString truncates content to 61 characters", () => {
  const content = "x".repeat(200);
  const result = messageToString({ role: "user", content });
  assert.equal(result, `#<Message role=user content=${"x".repeat(61)}...>`);
});
