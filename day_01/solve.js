import { readGroupedNumbers } from "../helpers.js";
import { equal } from "node:assert";
import _ from "lodash";

const DAY = `01`;

const getCaloriesPerElf = (input) =>
  _.chain(input)
    .map(_.sum)
    .sortBy((v) => -v);

const part1 = (input) => getCaloriesPerElf(input).first().value();

const part2 = (input) => getCaloriesPerElf(input).take(3).sum().value();

const example = await readGroupedNumbers(`./day_${DAY}/example.txt`);
const input = await readGroupedNumbers(`./day_${DAY}/input.txt`);

equal(await part1(example), 24000);
equal(await part1(input), 72017);

equal(await part2(example), 45000);
equal(await part2(input), 212520);

console.log(`Day ${DAY} completed ✔️`);
