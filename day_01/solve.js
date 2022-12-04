import { equal } from "node:assert";
import * as R from "ramda";
import { readGroupedNumbers } from "../helpers.js";

const DAY = `01`;

const getCaloriesPerElf = R.pipe(
  R.map(R.sum),
  R.sortBy((v) => -v)
);

const part1 = R.pipe(getCaloriesPerElf, R.head);
const part2 = R.pipe(getCaloriesPerElf, R.take(3), R.sum);

const example = await readGroupedNumbers(`./day_${DAY}/example.txt`);
const input = await readGroupedNumbers(`./day_${DAY}/input.txt`);

equal(await part1(example), 24000);
equal(await part1(input), 72017);

equal(await part2(example), 45000);
equal(await part2(input), 212520);

console.log(`Day ${DAY} completed ✔️`);
