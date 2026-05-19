import fs from "node:fs";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const yaml = require("js-yaml") as { load: (source: string) => unknown };

export function readYamlFile<T>(filePath: string, fallback: T): T {
  const raw = fs.readFileSync(filePath, "utf8");
  const parsed = yaml.load(raw);
  return (parsed ?? fallback) as T;
}
