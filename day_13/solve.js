import { equal } from "node:assert";
import * as R from "ramda";
import { readGroupedLines } from "../helpers.js";

const DAY = `13`;

const compare = (left, right) => {
  if (Number.isInteger(left) && Number.isInteger(right)) {
    return left - right;
  }

  if (!Array.isArray(left)) left = [left];
  if (!Array.isArray(right)) right = [right];

  // Make sure that arrays hve same length, as Ramda, unlike Lodash, trims longer array.
  left.length = right.length = Math.max(left.length, right.length);

  for (const [lhs, rhs] of R.zip(left, right)) {
    if (lhs === undefined) return -1;
    if (rhs === undefined) return 1;
    const order = compare(lhs, rhs);
    if (order !== 0) return order;
  }

  return 0;
};

const part1 = R.addIndex(R.reduce)((acc, [left, right], i) => {
  if (compare(JSON.parse(left), JSON.parse(right)) > 0) {
    return acc;
  }
  // packets are 1-based
  return (acc += i + 1);
}, 0);

const part2 = (input) => {
  const packets = input
    .flat()
    .concat("[[2]]", "[[6]]")
    .map(JSON.parse)
    .sort((a, b) => compare(a, b));
  // packets are 1-based
  return R.multiply(R.inc(R.findIndex(R.equals([[2]]), packets)), R.inc(R.findIndex(R.equals([[6]]), packets)));
};

const example = await readGroupedLines(`./day_${DAY}/example.txt`);
const input = await readGroupedLines(`./day_${DAY}/input.txt`);

try {
  equal(await part1(example), 13);
  equal(await part1(input), 5684);

  equal(await part2(example), 140);
  equal(await part2(input), 22932);

  console.log(`Day ${DAY} completed ✔️`);
} catch (e) {
  console.log(`Day ${DAY} failed 𝗫 - ${e.message}`);
}
