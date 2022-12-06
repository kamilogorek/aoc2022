import { equal } from "node:assert";
import * as R from "ramda";
import { readLines } from "../helpers.js";

const DAY = `06`;

class LRU {
  values = [];

  constructor(limit) {
    this.limit = limit;
  }

  get length() {
    return this.values.length;
  }

  get isUniqueOnly() {
    return this.length === new Set(this.values).size;
  }

  push(v) {
    if (this.length === this.limit) {
      this.values.shift();
    }
    this.values.push(v);
  }
}

const takeWhileNUnique = (buffer, limit) => {
  const lru = new LRU(limit);
  return R.takeWhile((v) => {
    lru.push(v);
    return lru.length < 4 || !lru.isUniqueOnly;
  }, buffer);
};

const part1 = ([buffer] = input) => takeWhileNUnique(buffer, 4).length + 1;
const part2 = ([buffer] = input) => takeWhileNUnique(buffer, 14).length + 1;

const example = await readLines(`./day_${DAY}/example.txt`);
const input = await readLines(`./day_${DAY}/input.txt`);

equal(await part1(example), 7);
equal(await part1(input), 1134);

equal(await part2(example), 19);
equal(await part2(input), 2263);

console.log(`Day ${DAY} completed ✔️`);
