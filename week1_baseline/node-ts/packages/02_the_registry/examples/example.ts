import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  loadConfig,
  tasks,
  userPromptsDir,
  PROMPTS_DIR,
  configToString,
  playerTask,
  createContext,
  contextToString,
  toolToString,
} from "@boukensha/01_struct_skeleton";
import { createRegistry, defineTool, dispatch } from "../src/registry.js";
import { UnknownToolError } from "../src/errors.js";

const HERE = path.dirname(fileURLToPath(import.meta.url));
process.env.BOUKENSHA_DIR ??= path.resolve(HERE, "../../../../../.boukensha");

const config = loadConfig();
const playerSettings = tasks(config, "player");
const system = playerTask.systemPrompt(playerSettings, {
  userPromptsDir: userPromptsDir(config),
  defaultPromptsDir: PROMPTS_DIR,
});

const ctx = createContext({ task: playerTask.TASK_NAME, system });
const registry = createRegistry(ctx);

// Notice that we now register the tools through the registry instead of directly
// on the context in the previous step.
// They will still be attached to context which is why we pass it into
// our registry when we initialize it.
defineTool(
  registry,
  "move",
  {
    description: "Move the player in a direction (north, south, east, west, up, down)",
    parameters: { direction: { type: "string", description: "The direction to move" } },
  },
  ({ direction }) => `You move ${direction} into a torch-lit corridor.`,
);

defineTool(
  registry,
  "shout",
  {
    description: "Shout a message so everyone in the zone can hear it",
    parameters: { message: { type: "string", description: "The message to shout" } },
  },
  ({ message }) => (message as string).toUpperCase(),
);

console.log("=== BOUKENSHA Step 2: Tool Registry ===\n");
console.log(`Config:  ${configToString(config)}`);
console.log(`Context: ${contextToString(ctx)}`);
console.log("Tools:");
for (const tool of Object.values(ctx.tools)) {
  console.log(`  ${toolToString(tool)}`);
}
console.log();

// Here we are mimicking what the agent would do when
// it needs to call a tool from the registry. We are
// still missing the actual code that would decide when
// to call the registry for a tool.
console.log("Dispatching 'shout' with message='dragon spotted'...");
console.log(`Result: ${dispatch(registry, "shout", { message: "dragon spotted" })}`);
console.log();

console.log("Dispatching 'move' with direction='north'...");
console.log(`Result: ${dispatch(registry, "move", { direction: "north" })}`);
console.log();

try {
  dispatch(registry, "flee");
} catch (e) {
  if (e instanceof UnknownToolError) {
    console.log(`UnknownToolError caught: ${e.message}`);
  } else {
    throw e;
  }
}
