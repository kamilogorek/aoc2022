import { equal } from "node:assert";
import * as R from "ramda";
import { readLines } from "../helpers.js";

const DAY = `20`;

class CircularSeenBuffer {
  constructor(values) {
    this.values = [...values.map((value) => ({ value, seen: false }))];
  }

  move(val) {
    const idx = this.values.findIndex(({ value, seen }) => value === val && !seen);

    if (val === 0) {
      this.values[idx].seen = true;
      return;
    }

    const entry = this.values.splice(idx, 1)[0];
    entry.seen = true;

    let nextIdx = (idx + val) % this.values.length;

    if (nextIdx < 0) {
      nextIdx = this.values.length + nextIdx;
    } else if (nextIdx > this.values.length) {
      nextIdx = nextIdx - this.values.length;
    }

    this.values.splice(nextIdx, 0, entry);
  }

  valAfterZero(n) {
    const zero = this.values.findIndex(({ value }) => value === 0);
    const idx = (zero + n) % this.values.length;
    return this.values[idx].value;
  }
}

const part1 = (input) => {
  const nums = input.map((v) => parseInt(v, 10));
  const buffer = new CircularSeenBuffer(nums);
  while (nums.length) {
    buffer.move(nums.shift());
  }
  return [1000, 2000, 3000].map((v) => buffer.valAfterZero(v)).reduce((acc, v) => acc + v);
};

const part2 = (input) => {};

const example = await readLines(`./day_${DAY}/example.txt`);
const input = await readLines(`./day_${DAY}/input.txt`);

try {
  equal(await part1(example), 3);
  equal(await part1(input), 8721);

  equal(await part2(example), 1623178306);
  equal(await part2(input), +Infinity);

  console.log(`Day ${DAY} completed ✔️`);
} catch (e) {
  console.log(`Day ${DAY} failed 𝗫 - ${e.message}`);
}
