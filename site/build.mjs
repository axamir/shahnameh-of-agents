import { mkdir, readFile, readdir, cp, writeFile } from "node:fs/promises";

const out = new URL("./dist/", import.meta.url);
await mkdir(out, { recursive: true });
for (const file of ["index.html", "styles.css", "app.js", "og-shahnameh.svg"]) {
  await cp(new URL(file, import.meta.url), new URL(file, out));
}
await cp(new URL("../assets/", import.meta.url), new URL("./assets/", out), { recursive: true });
const manifest = {};
for (const lang of ["fa", "en"]) {
  const source = new URL("../" + lang + "/", import.meta.url);
  const target = new URL("./content/" + lang + "/", out);
  await mkdir(target, { recursive: true });
  const files = (await readdir(source))
    .filter((name) => /^\d+.*\.md$/i.test(name) && !name.startsWith("_"))
    .sort((a, b) => a.localeCompare(b, "en", { numeric: true }));
  manifest[lang] = [];
  for (const [index, file] of files.entries()) {
    const markdown = await readFile(new URL(file, source), "utf8");
    const match = markdown.match(/^#\s+(.+)$/m);
    const title = match ? match[1].replace(/[*_]/g, "") : file.replace(/\.md$/i, "");
    const numberMatch = file.match(/^\d+/);
    const number = Number(numberMatch ? numberMatch[0] : index);
    const act = number <= 7 ? 1 : number <= 14 ? 2 : number <= 30 ? 3 : number === 31 ? 4 : 5;
    manifest[lang].push({ file, title, number, act });
    await writeFile(new URL(file, target), markdown);
  }
}
await writeFile(new URL("./content/manifest.json", out), JSON.stringify(manifest, null, 2));
await writeFile(new URL(".nojekyll", out), "");
console.log("Built " + manifest.fa.length + " Persian and " + manifest.en.length + " English chapters.");
