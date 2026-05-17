import fs from "fs";

let world = JSON.parse(fs.readFileSync("./world.json", "utf-8"));

const i = world.version + 1;
const entropy = Math.abs(Math.sin(i / 10));

world.version = i;
world.state.entropy = entropy;

world.history.push({
  event: `STEP_${i}`,
  actor: "GITHUB_ACTION",
  version: i,
  timestamp: new Date().toISOString()
});

fs.writeFileSync("./world.json", JSON.stringify(world, null, 2));

console.log("STEP DONE:", i);
