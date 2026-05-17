import fs from "fs";

const world = JSON.parse(fs.readFileSync("./core/world.json", "utf-8"));

const i = world.version + 1;

// قانون ساده کنترل‌شده (نه آشوبی)
const entropy = Math.abs(Math.sin(i / 7)) * 0.5;

world.version = i;
world.state.entropy = Number(entropy.toFixed(4));

world.history.push({
  event: `CORE_STEP_${i}`,
  actor: "CORE_ENGINE",
  version: i,
  timestamp: new Date().toISOString()
});

fs.writeFileSync("./core/world.json", JSON.stringify(world, null, 2));

console.log("CORE STEP:", i);
