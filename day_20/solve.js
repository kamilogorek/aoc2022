import { equal } from "node:assert";
import * as R from "ramda";
import { readLines } from "../helpers.js";

const DAY = `20`;

const part1 = (input) => {};

const part2 = (input) => {};

const example = await readLines(`./day_${DAY}/example.txt`);
const input = await readLines(`./day_${DAY}/input.txt`);

equal(await part1(example), +Infinity);
equal(await part1(input), +Infinity);

equal(await part2(example), +Infinity);
equal(await part2(input), +Infinity);

console.log(`Day ${DAY} completed ✔️`);
