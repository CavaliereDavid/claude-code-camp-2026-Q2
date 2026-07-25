import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  loadConfig,
  tasks,
  userPromptsDir,
  mudHost,
  mudPort,
  mudUsername,
  PROMPTS_DIR,
  configToString,
} from "../src/config.js";
import { provider, model, promptOverride, systemPrompt } from "../src/tasks/player.js";

const HERE = path.dirname(fileURLToPath(import.meta.url));
process.env.BOUKENSHA_DIR ??= path.resolve(HERE, "../../../../../.boukensha");

const config = loadConfig();
const playerSettings = tasks(config, "player");

console.log("=== Boukensha Step 0: Configuration ===\n");
console.log(`Config dir:     ${config.dir}`);
console.log(`Tasks:          ${Object.keys(tasks(config)).join(", ")}\n`);
console.log("-- player task --");
console.log(`Provider:       ${provider(playerSettings)}`);
console.log(`Model:          ${model(playerSettings)}`);
console.log(`Prompt override?${promptOverride(playerSettings, "system")}`);
const prompt = systemPrompt(playerSettings, {
  userPromptsDir: userPromptsDir(config),
  defaultPromptsDir: PROMPTS_DIR,
});
console.log(`System prompt:  ${(prompt ?? "").slice(0, 60)}...\n`);
console.log(`MUD host:       ${mudHost(config)}:${mudPort(config)}`);
console.log(`MUD user:       ${mudUsername(config)}\n`);
console.log(`API key set?    ${process.env.ANTHROPIC_API_KEY !== undefined}\n`);
console.log(configToString(config));
