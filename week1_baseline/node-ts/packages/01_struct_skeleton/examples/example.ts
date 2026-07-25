import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadConfig, tasks, userPromptsDir, PROMPTS_DIR, configToString, playerTask } from "@boukensha/00_config";
import { createContext, registerTool, addMessage, contextToString } from "../src/context.js";
import { toolToString } from "../src/tool.js";
import { messageToString } from "../src/message.js";

const HERE = path.dirname(fileURLToPath(import.meta.url));
process.env.BOUKENSHA_DIR ??= path.resolve(HERE, "../../../../../.boukensha");

const config = loadConfig();
const playerSettings = tasks(config, "player");
const system = playerTask.systemPrompt(playerSettings, {
  userPromptsDir: userPromptsDir(config),
  defaultPromptsDir: PROMPTS_DIR,
});

const ctx = createContext({ task: playerTask.TASK_NAME, system });

registerTool(ctx, {
  name: "move",
  description: "Move the player in a direction (north, south, east, west, up, down)",
  parameters: { direction: { type: "string", description: "The direction to move" } },
  block: ({ direction }) => `You move ${direction} into a torch-lit corridor.`,
});

addMessage(ctx, "user", "Explore north and tell me what you find.");
addMessage(ctx, "assistant", "Sure, let me head north and take a look.");

console.log("=== Boukensha Step 1: Struct Skeleton ===\n");
console.log(`Config:   ${configToString(config)}`);
console.log(`Context:  ${contextToString(ctx)}`);
console.log(`Tool:     ${toolToString(ctx.tools["move"]!)}`);
console.log("Messages:");
ctx.messages.forEach((m) => console.log(`  ${messageToString(m)}`));
