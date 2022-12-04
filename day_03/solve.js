import { equal } from "node:assert";
import * as R from "ramda";
import { readLines } from "../helpers.js";

const DAY = `03`;

const splitInHalf = (l) => R.splitAt(l.length / 2, l);
const intersectionAll = (a) => R.reduce(R.intersection, R.head(a), R.tail(a));
const charToPriority = (c) => (c.codePointAt(0) - 96 + 58) % 58;
const findIntersectionPriority = R.pipe(intersectionAll, R.head, charToPriority);

const part1 = R.pipe(R.map(splitInHalf), R.map(findIntersectionPriority), R.sum);
const part2 = R.pipe(R.map(Array.from), R.splitEvery(3), R.map(findIntersectionPriority), R.sum);

const example = await readLines(`./day_${DAY}/example.txt`);
const input = await readLines(`./day_${DAY}/input.txt`);

equal(await part1(example), 157);
equal(await part1(input), 8123);

equal(await part2(example), 70);
equal(await part2(input), 2620);

console.log(`Day ${DAY} completed ✔️`);
