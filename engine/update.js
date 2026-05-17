import fs from "fs";

const world = JSON.parse(fs.readFileSync("./world.json", "utf-8"));

const output = {
  state: {
    mood: "evolving",
    entropy: Math.random(),
    myth_level: Math.random()
  },
  event: "local simulation step (no API yet)"
};

world.version += 1;
world.state = output.state;
world.history.push({
  event: output.event,
  actor: "AI-SIM",
  version: world.version
});

fs.writeFileSync("./world.json", JSON.stringify(world, null, 2));

console.log("World evolved:", output.event);
