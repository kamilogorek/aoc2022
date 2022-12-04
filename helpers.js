import { readFile } from "node:fs/promises";

export async function readLines(path) {
  const content = await readFile(path, "utf-8");
  return content.split("\n");
}

export async function readGroupedLines(path) {
  const content = await readFile(path, "utf-8");
  return content.split("\n\n").map((g) => g.split("\n"));
}

export async function readNumbers(path) {
  const lines = await readLines(path);
  return lines.map((v) => parseInt(v, 10));
}

export async function readGroupedNumbers(path) {
  const groups = await readGroupedLines(path);
  return groups.map((g) => g.map((v) => parseInt(v, 10)));
}
