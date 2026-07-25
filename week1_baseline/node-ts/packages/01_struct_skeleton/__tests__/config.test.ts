import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

import {
  loadConfig,
  tasks,
  userPromptsDir,
  mudHost,
  mudPort,
  mudUsername,
  mudPassword,
  dig,
  configToString,
  DEFAULT_DIR,
} from "../src/config.js";
import {
  provider,
  model,
  promptOverride,
  prompt,
  systemPrompt,
} from "../src/tasks/base.js";
import * as player from "../src/tasks/player.js";

// ---------- fixture helpers -------------------------------------------

function makeFixtureDir(): string {
  return fs.mkdtempSync(path.join(os.tmpdir(), "boukensha-config-test-"));
}

function withBoukenshaDir<T>(dir: string, fn: () => T): T {
  const previous = process.env.BOUKENSHA_DIR;
  process.env.BOUKENSHA_DIR = dir;
  try {
    return fn();
  } finally {
    if (previous === undefined) {
      delete process.env.BOUKENSHA_DIR;
    } else {
      process.env.BOUKENSHA_DIR = previous;
    }
  }
}

function writeFile(filePath: string, contents: string): void {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, contents);
}

// ---------- dig() --------------------------------------------------------

test("dig returns a nested value", () => {
  const settings = { mud: { host: "localhost" } };
  assert.equal(dig(settings, "mud", "host"), "localhost");
});

test("dig returns undefined for a missing path", () => {
  const settings = { mud: { host: "localhost" } };
  assert.equal(dig(settings, "mud", "port"), undefined);
});

test("dig returns undefined when a middle node isn't an object", () => {
  const settings = { mud: "not-an-object" };
  assert.equal(dig(settings, "mud", "host"), undefined);
});

// ---------- loadConfig() / dir resolution --------------------------------

test("loadConfig falls back to DEFAULT_DIR when BOUKENSHA_DIR is unset", () => {
  const previous = process.env.BOUKENSHA_DIR;
  delete process.env.BOUKENSHA_DIR;
  try {
    const config = loadConfig();
    assert.equal(config.dir, path.resolve(DEFAULT_DIR));
  } finally {
    if (previous !== undefined) process.env.BOUKENSHA_DIR = previous;
  }
});

test("loadConfig resolves a relative BOUKENSHA_DIR to an absolute path", () => {
  const dir = makeFixtureDir();
  const relative = path.relative(process.cwd(), dir);
  withBoukenshaDir(relative, () => {
    const config = loadConfig();
    assert.equal(config.dir, path.resolve(relative));
    assert.equal(path.isAbsolute(config.dir), true);
  });
});

test("loadConfig returns empty settings when settings.yaml is absent", () => {
  const dir = makeFixtureDir();
  withBoukenshaDir(dir, () => {
    const config = loadConfig();
    assert.deepEqual(config.settings, {});
  });
});

test("loadConfig parses settings.yaml when present", () => {
  const dir = makeFixtureDir();
  writeFile(
    path.join(dir, "settings.yaml"),
    "tasks:\n  player:\n    provider: anthropic\n    model: claude-haiku-4-5\n",
  );
  withBoukenshaDir(dir, () => {
    const config = loadConfig();
    assert.deepEqual(config.settings, {
      tasks: { player: { provider: "anthropic", model: "claude-haiku-4-5" } },
    });
  });
});

test("loadConfig silently skips a missing .env file", () => {
  const dir = makeFixtureDir();
  withBoukenshaDir(dir, () => {
    assert.doesNotThrow(() => loadConfig());
  });
});

test("loadConfig loads a present .env file into process.env", () => {
  const dir = makeFixtureDir();
  writeFile(path.join(dir, ".env"), 'BOUKENSHA_TEST_VAR="hello"\n');
  withBoukenshaDir(dir, () => {
    loadConfig();
  });
  assert.equal(process.env.BOUKENSHA_TEST_VAR, "hello");
  delete process.env.BOUKENSHA_TEST_VAR;
});

// ---------- tasks() -------------------------------------------------------

test("tasks() with no name returns the full tasks map", () => {
  const dir = makeFixtureDir();
  writeFile(
    path.join(dir, "settings.yaml"),
    "tasks:\n  player:\n    provider: anthropic\n",
  );
  withBoukenshaDir(dir, () => {
    const config = loadConfig();
    assert.deepEqual(tasks(config), { player: { provider: "anthropic" } });
  });
});

test("tasks() with a name returns that task's settings", () => {
  const dir = makeFixtureDir();
  writeFile(
    path.join(dir, "settings.yaml"),
    "tasks:\n  player:\n    provider: anthropic\n",
  );
  withBoukenshaDir(dir, () => {
    const config = loadConfig();
    assert.deepEqual(tasks(config, "player"), { provider: "anthropic" });
  });
});

test("tasks() with an unknown name returns an empty object", () => {
  const dir = makeFixtureDir();
  withBoukenshaDir(dir, () => {
    const config = loadConfig();
    assert.deepEqual(tasks(config, "nonexistent"), {});
  });
});

test("tasks() with no settings.yaml returns an empty object", () => {
  const dir = makeFixtureDir();
  withBoukenshaDir(dir, () => {
    const config = loadConfig();
    assert.deepEqual(tasks(config), {});
  });
});

// ---------- userPromptsDir() ----------------------------------------------

test("userPromptsDir joins the config dir with 'prompts'", () => {
  const dir = makeFixtureDir();
  withBoukenshaDir(dir, () => {
    const config = loadConfig();
    assert.equal(userPromptsDir(config), path.join(dir, "prompts"));
  });
});

// ---------- mud* -----------------------------------------------------------

test("mudHost/mudPort default when mud settings are absent", () => {
  const dir = makeFixtureDir();
  withBoukenshaDir(dir, () => {
    const config = loadConfig();
    assert.equal(mudHost(config), "localhost");
    assert.equal(mudPort(config), 4000);
  });
});

test("mudHost/mudPort use settings.yaml values when present", () => {
  const dir = makeFixtureDir();
  writeFile(
    path.join(dir, "settings.yaml"),
    "mud:\n  host: example.mud\n  port: 5000\n",
  );
  withBoukenshaDir(dir, () => {
    const config = loadConfig();
    assert.equal(mudHost(config), "example.mud");
    assert.equal(mudPort(config), 5000);
  });
});

test("mudUsername/mudPassword are undefined when absent", () => {
  const dir = makeFixtureDir();
  withBoukenshaDir(dir, () => {
    const config = loadConfig();
    assert.equal(mudUsername(config), undefined);
    assert.equal(mudPassword(config), undefined);
  });
});

test("mudUsername/mudPassword reflect settings.yaml values", () => {
  const dir = makeFixtureDir();
  writeFile(
    path.join(dir, "settings.yaml"),
    "mud:\n  username: dummy\n  password: helloworld\n",
  );
  withBoukenshaDir(dir, () => {
    const config = loadConfig();
    assert.equal(mudUsername(config), "dummy");
    assert.equal(mudPassword(config), "helloworld");
  });
});

// ---------- configToString() -----------------------------------------------

test("configToString formats dir and task names", () => {
  const dir = makeFixtureDir();
  writeFile(
    path.join(dir, "settings.yaml"),
    "tasks:\n  player:\n    provider: anthropic\n",
  );
  withBoukenshaDir(dir, () => {
    const config = loadConfig();
    assert.equal(configToString(config), `#<Config dir=${dir} tasks=player>`);
  });
});

// ---------- tasks/base.ts: provider() / model() -----------------------------

test("base.provider returns the configured provider", () => {
  assert.equal(provider("player", { provider: "anthropic" }), "anthropic");
});

test("base.provider throws a descriptive error when missing", () => {
  assert.throws(
    () => provider("player", {}),
    /tasks\.player\.provider is required in settings\.yml/,
  );
});

test("base.model returns the configured model", () => {
  assert.equal(model("player", { model: "claude-haiku-4-5" }), "claude-haiku-4-5");
});

test("base.model throws a descriptive error when missing", () => {
  assert.throws(
    () => model("player", {}),
    /tasks\.player\.model is required in settings\.yml/,
  );
});

// ---------- tasks/base.ts: promptOverride() ----------------------------------

test("promptOverride is false when prompt_override is absent", () => {
  assert.equal(promptOverride({}), false);
});

test("promptOverride is false when prompt_override isn't an object", () => {
  assert.equal(promptOverride({ prompt_override: "yes" }), false);
});

test("promptOverride is true only for a strict boolean true", () => {
  assert.equal(promptOverride({ prompt_override: { system: true } }, "system"), true);
  assert.equal(promptOverride({ prompt_override: { system: "true" } }, "system"), false);
  assert.equal(promptOverride({ prompt_override: { system: false } }, "system"), false);
});

// ---------- tasks/base.ts: prompt() / systemPrompt() --------------------------

test("prompt falls back to the default prompt when override is disabled", () => {
  const defaultDir = makeFixtureDir();
  writeFile(path.join(defaultDir, "system.md"), "  default system prompt  \n");

  const result = prompt("player", {}, "system", { defaultPromptsDir: defaultDir });
  assert.equal(result, "default system prompt");
});

test("prompt uses the user override when enabled and the file exists", () => {
  const userDir = makeFixtureDir();
  const defaultDir = makeFixtureDir();
  writeFile(path.join(userDir, "player", "system.md"), "custom prompt\n");
  writeFile(path.join(defaultDir, "system.md"), "default prompt\n");

  const settings = { prompt_override: { system: true } };
  const result = prompt("player", settings, "system", {
    userPromptsDir: userDir,
    defaultPromptsDir: defaultDir,
  });
  assert.equal(result, "custom prompt");
});

test("prompt falls back to the default prompt when override is enabled but the user file is missing", () => {
  const userDir = makeFixtureDir();
  const defaultDir = makeFixtureDir();
  writeFile(path.join(defaultDir, "system.md"), "default prompt\n");

  const settings = { prompt_override: { system: true } };
  const result = prompt("player", settings, "system", {
    userPromptsDir: userDir,
    defaultPromptsDir: defaultDir,
  });
  assert.equal(result, "default prompt");
});

test("prompt returns undefined when neither directory yields a file", () => {
  const result = prompt("player", {}, "system", {});
  assert.equal(result, undefined);
});

test("systemPrompt is a shorthand for prompt(..., 'system', ...)", () => {
  const defaultDir = makeFixtureDir();
  writeFile(path.join(defaultDir, "system.md"), "default prompt\n");
  const result = systemPrompt("player", {}, { defaultPromptsDir: defaultDir });
  assert.equal(result, "default prompt");
});

// ---------- tasks/player.ts: bound convenience wrappers ------------------------

test("player.TASK_NAME is 'player'", () => {
  assert.equal(player.TASK_NAME, "player");
});

test("player.provider/model delegate to base with taskName 'player'", () => {
  assert.equal(player.provider({ provider: "anthropic" }), "anthropic");
  assert.equal(player.model({ model: "claude-haiku-4-5" }), "claude-haiku-4-5");
  assert.throws(
    () => player.provider({}),
    /tasks\.player\.provider is required in settings\.yml/,
  );
});

test("player.promptOverride/systemPrompt delegate to base", () => {
  const userDir = makeFixtureDir();
  const defaultDir = makeFixtureDir();
  writeFile(path.join(userDir, "player", "system.md"), "custom prompt\n");
  writeFile(path.join(defaultDir, "system.md"), "default prompt\n");

  const settings = { prompt_override: { system: true } };
  assert.equal(player.promptOverride(settings, "system"), true);
  assert.equal(
    player.systemPrompt(settings, { userPromptsDir: userDir, defaultPromptsDir: defaultDir }),
    "custom prompt",
  );
});
