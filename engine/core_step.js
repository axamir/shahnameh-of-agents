import fs from "fs";

const world = JSON.parse(fs.readFileSync("./core/world.json", "utf-8"));
const rules = JSON.parse(fs.readFileSync("./core/decision.json", "utf-8"));

const i = world.version + 1;
const newEntropy = Math.abs(Math.sin(i / 7)) * 0.5;

const delta = Math.abs(newEntropy - world.state.entropy);

// 🧠 تصمیم‌گیری
const shouldEvolve =
  rules.allow_evolution &&
  delta >= rules.min_entropy_change;

if (!shouldEvolve) {
  console.log("SKIP STEP:", i, "delta too small:", delta.toFixed(4));
  process.exit(0);
}

// 🔁 apply evolution
world.version = i;
world.state.entropy = Number(newEntropy.toFixed(4));

world.history.push({
  event: `DECISION_STEP_${i}`,
  actor: "DECISION_ENGINE",
  delta: Number(delta.toFixed(4)),
  timestamp: new Date().toISOString()
});

fs.writeFileSync("./core/world.json", JSON.stringify(world, null, 2));

console.log("EVOLVED STEP:", i, "delta:", delta.toFixed(4));
