import { readLines } from "../helpers.js";
import { equal } from "node:assert";

const DAY = `03`;

const charToPriority = (char) => (char.codePointAt(0) - 96 + 58) % 58;

const part1 = (input) =>
  input
    .map((line) => {
      const [left, right] = [
        new Set(line.slice(0, line.length / 2)),
        new Set(line.slice(line.length / 2)),
      ];
      const common = [...left].filter((v) => right.has(v))[0];
      return charToPriority(common);
    })
    .reduce((a, b) => a + b);

const part2 = (input) =>
  input
    .reduce(
      (groups, line) => {
        if (groups[groups.length - 1].length === 3) {
          groups.push([line]);
        } else {
          groups[groups.length - 1].push(line);
        }
        return groups;
      },
      [[]]
    )
    .map((group) => {
      const [first, second, third] = group.map((v) => new Set(v));
      const common = [...first].filter((v) => second.has(v) && third.has(v))[0];
      return charToPriority(common);
    })
    .reduce((a, b) => a + b);

const example = await readLines(`./day_${DAY}/example.txt`);
const input = await readLines(`./day_${DAY}/input.txt`);

equal(await part1(example), 157);
equal(await part1(input), 8123);

equal(await part2(example), 70);
equal(await part2(input), 2620);

console.log(`Day ${DAY} completed ✔️`);
