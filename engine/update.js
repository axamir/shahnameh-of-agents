import fs from "fs";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const world = JSON.parse(fs.readFileSync("./world.json", "utf-8"));

const prompt = `
You are Echo Civilization Engine.

Evolve this world ONE step forward.
Be creative but consistent.

World state:
${JSON.stringify(world)}

Return ONLY valid JSON:
{
  "state": {
    "mood": string,
    "entropy": number,
    "myth_level": number
  },
  "event": string
}
`;

const response = await client.chat.completions.create({
  model: "gpt-4.1-mini",
  messages: [{ role: "user", content: prompt }]
});

const output = JSON.parse(response.choices[0].message.content);

world.version += 1;
world.state = output.state;
world.history.push({
  event: output.event,
  actor: "AI",
  version: world.version,
  timestamp: new Date().toISOString()
});

fs.writeFileSync("./world.json", JSON.stringify(world, null, 2));

console.log("🌍 World evolved:", output.event);
