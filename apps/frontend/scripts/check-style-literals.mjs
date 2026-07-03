import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

const sourceRoot = path.resolve("src");
const definitionFiles = new Set([
  "app/theme.ts",
  "styles/variables.css"
]);
const visualizationAllowlist = new Set([
  // Intentional Event card and tier data-visualization gradients.
  "features/events/components/EventTierBadge.css",
  "pages/EventsPage/EventsPage.css"
]);
const rules = [
  { name: "color literal", pattern: /#[0-9a-f]{3,8}\b|(?:rgb|hsl)a?\(/i },
  { name: "font-family literal", pattern: /font-family\s*:\s*["']/i },
  { name: "border-radius literal", pattern: /border-radius\s*:\s*(?:\d|\.)/i }
];

async function files(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(entries.map((entry) => {
    const target = path.join(directory, entry.name);
    return entry.isDirectory() ? files(target) : [target];
  }));
  return nested.flat();
}

const violations = [];
for (const file of await files(sourceRoot)) {
  if (!/\.css$/.test(file)) continue;
  const relative = path.relative(sourceRoot, file).replaceAll("\\", "/");
  if (definitionFiles.has(relative) || visualizationAllowlist.has(relative)) continue;
  const lines = (await readFile(file, "utf8")).split(/\r?\n/);
  lines.forEach((line, index) => {
    for (const rule of rules) {
      if (rule.pattern.test(line)) violations.push(`${relative}:${index + 1} ${rule.name}: ${line.trim()}`);
    }
  });
}

if (violations.length) {
  console.error(violations.join("\n"));
  process.exitCode = 1;
} else {
  console.log("Frontend style literal check passed.");
}
