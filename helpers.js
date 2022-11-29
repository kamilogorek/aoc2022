import { readFile } from "node:fs/promises";

export async function readLines(path) {
  const content = await readFile(path, "utf-8");
  return content
    .trim()
    .split("\n")
    .map((v) => v.trim());
}

export async function readNumbers(path) {
  const lines = await readLines(path);
  return lines.map((v) => parseInt(v, 10));
}
