import { equal } from "node:assert";
import * as R from "ramda";
import { readLines } from "../helpers.js";

const DAY = `16`;

const parseInput = (input) => {
  const valves = new Map();
  input.forEach((line) => {
    let [_, src, rate, dst] = line.match(/Valve (..) has flow rate=(\d+); tunnels? leads? to valves? (.+)/);
    valves.set(src, { dst: dst.split(", "), rate: parseInt(rate, 10) });
  });
  return valves;
};

const part1 = (input) => {
  const start = "AA";
  const parsed = parseInput(input);
};

const part2 = (input) => {};

const example = await readLines(`./day_${DAY}/example.txt`);
const input = await readLines(`./day_${DAY}/input.txt`);

try {
  equal(await part1(example), 1651);
  equal(await part1(input), +Infinity);

  equal(await part2(example), +Infinity);
  equal(await part2(input), +Infinity);

  console.log(`Day ${DAY} completed ✔️`);
} catch (e) {
  console.log(`Day ${DAY} failed 𝗫 - ${e.message}`);
}
