// The plugin directory wants hooks to start a file the plugin ships. This only runs the glen line.
// A shell finds glen on every OS (npm installs a .cmd on Windows); the words come from hooks.json.
import { spawnSync } from "node:child_process";

const glen = spawnSync(`glen ${process.argv.slice(2).join(" ")}`, {
  stdio: "inherit",
  shell: true,
});
process.exitCode = glen.status ?? 1;
