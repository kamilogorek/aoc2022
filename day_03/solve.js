import { readLines } from "../helpers.js";
import { equal } from "node:assert";
import _ from "lodash";

const DAY = `03`;

const charToPriority = (char) => (char.codePointAt(0) - 96 + 58) % 58;
const findIntersectionPriority = (groups) => _.intersection(...groups).map(charToPriority)[0];

const part1 = (input) =>
  _(input)
    .map((line) => _.chunk(line, line.length / 2))
    .map(findIntersectionPriority)
    .sum();

const part2 = (input) => _(input).map(_.toArray).chunk(3).map(findIntersectionPriority).sum();

const example = await readLines(`./day_${DAY}/example.txt`);
const input = await readLines(`./day_${DAY}/input.txt`);

equal(await part1(example), 157);
equal(await part1(input), 8123);

equal(await part2(example), 70);
equal(await part2(input), 2620);

console.log(`Day ${DAY} completed ✔️`);
