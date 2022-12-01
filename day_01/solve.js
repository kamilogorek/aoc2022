import { readNumbers } from "../helpers.js";
import { equal } from "node:assert";

const DAY = `01`;

const getCaloriesPerElf = (input) => {
  return input
    .reduce(
      (acc, val) => {
        if (Number.isNaN(val)) {
          acc.push([]);
        } else {
          acc[acc.length - 1].push(val);
        }
        return acc;
      },
      [[]]
    )
    .map((group) => group.reduce((a, b) => a + b), 0)
    .sort((a, b) => b - a);
};

const part1 = (input) => getCaloriesPerElf(input)[0];

const part2 = (input) =>
  getCaloriesPerElf(input)
    .slice(0, 3)
    .reduce((a, b) => a + b, 0);

const example = await readNumbers(`./day_${DAY}/example.txt`);
const input = await readNumbers(`./day_${DAY}/input.txt`);

equal(await part1(example), 24000);
equal(await part1(input), 72017);

equal(await part2(example), 45000);
equal(await part2(input), 212520);

console.log(`Day ${DAY} completed ✔️`);
