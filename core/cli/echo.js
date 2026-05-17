import fs from "fs";
import { execSync } from "child_process";

const cmd = process.argv[2];

function status() {
  const world = JSON.parse(fs.readFileSync("./core/world.json", "utf-8"));
  console.log("🌍 WORLD STATUS");
  console.log("version:", world.version);
  console.log("entropy:", world.state.entropy);
  console.log("mood:", world.state.mood);
}

function evolve() {
  execSync("node engine/core_step.js");
  execSync("git add core/world.json");
  execSync(`git commit -m "manual evolution step"`);
  console.log("⚡ world evolved");
}

function sync() {
  execSync("git pull --rebase origin main && git push origin main", { stdio: "inherit" });
}

function help() {
  console.log(`
Commands:
  status   → show world state
  evolve   → run one evolution step
  sync     → sync with remote
`);
}

switch (cmd) {
  case "status":
    status();
    break;
  case "evolve":
    evolve();
    break;
  case "sync":
    sync();
    break;
  default:
    help();
}
