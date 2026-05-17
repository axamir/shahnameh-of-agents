import fs from "fs";
import { execSync } from "child_process";

let world = JSON.parse(fs.readFileSync("./world.json", "utf-8"));

function commit(step) {
  execSync(`git add world.json`);
  execSync(`git commit -m "chain step ${step}"`);
}

function step(i) {
  // deterministic evolution (no randomness chaos)
  const entropy = Math.abs(Math.sin(i / 10));

  const event = `STEP_${i} | entropy_shift=${entropy.toFixed(4)}`;

  world.version += 1;
  world.state.entropy = entropy;

  world.history.push({
    event,
    actor: "CHAIN_ENGINE",
    version: world.version,
    timestamp: new Date().toISOString()
  });

  fs.writeFileSync("./world.json", JSON.stringify(world, null, 2));

  console.log(event);

  commit(i);
}

// run 1000 steps
for (let i = 1; i <= 1000; i++) {

  step(i);

  // checkpoint system every 100 steps
  if (i % 100 === 0) {
    fs.writeFileSync(
      `./checkpoint_${i}.json`,
      JSON.stringify(world, null, 2)
    );

    execSync(`git add checkpoint_${i}.json`);
    execSync(`git commit -m "checkpoint ${i}"`);
  }
}

console.log("🌍 CHAIN COMPLETE — 1000 steps generated");
