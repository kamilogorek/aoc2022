import { equal } from "node:assert";
import * as R from "ramda";
import { readLines } from "../helpers.js";

const DAY = `17`;

const BLOCK = "#";

class Block {
  constructor(coords) {
    this.coords = coords;
    this.width = Math.max(...coords.map((v) => v.length));
    this.height = coords.length;
    this.x = 3;
  }

  toRows() {
    const chamberWidth = 9;
    return this.coords.map((row) => [
      BLOCK,
      ...new Array(this.x - 1).fill("."),
      ...row,
      ...new Array(chamberWidth - this.x - this.width - 1).fill("."),
      BLOCK,
    ]);
  }

  shift(dir) {
    if (dir === "<") {
      this.shiftLeft();
    } else {
      this.shiftRight();
    }
  }

  // BUG: It cannot detect already placed blocks
  shiftLeft() {
    this.x = Math.max(this.x - 1, 1);
  }

  // BUG: It cannot detect already placed blocks
  shiftRight() {
    this.x = Math.min(this.x + 1, 9 - this.width - 1);
  }
}

const SHAPES = `
####

.#.
###
.#.

..#
..#
###

#
#
#
#

##
##
`
  .trim()
  .split("\n\n")
  .map((g) =>
    g
      .split("\n")
      .reverse()
      .map((l) => l.split(""))
  );

function* cycle(values) {
  let current = 0;
  while (true) {
    yield values[current];
    current++;
    if (current === values.length) {
      current = 0;
    }
  }
}

const printChamber = (chamber) =>
  console.log(
    [...chamber]
      .reverse()
      .map((l) => l.join(""))
      .join("\n")
  );

const mergeRows = (a, b) => {
  const n = [...a];
  b.forEach((v, i) => {
    if (v === BLOCK) {
      n[i] = v;
    }
  });
  return n;
};

const simulateFall = (chamber, coords, flow) => {
  const block = new Block(coords);

  block.shift(flow.next().value);
  block.shift(flow.next().value);
  block.shift(flow.next().value);
  block.shift(flow.next().value);

  let y = 0;
  let res = colliding(chamber, block, y);
  while (!res.done) {
    y += 1;
    res = colliding(chamber, block, y);
    block.shift(flow.next().value);
  }

  if (res.offset === 0) {
    chamber.push(...block.toRows());
  } else {
    const rows = block.toRows();
    for (let i = 0; i < res.offset; i++) {
      if (chamber[chamber.length - 1 - i]) {
        rows[i] = mergeRows(rows[i], chamber[chamber.length - 1 - i]);
      }
    }
    for (let i = 0; i < res.offset; i++) {
      chamber.pop();
    }
    chamber.push(...rows);
  }
};

const colliding = (chamber, block, y) => {
  const rows = block.toRows();
  const lastBlockRow = rows[rows.length - 1];
  const prevLastBlockRow = rows[rows.length - 2];
  const lastChamberRow = chamber[chamber.length - 1 - y];

  for (let i = 1; i <= 7; i++) {
    if (lastChamberRow[i] === BLOCK && lastBlockRow[i] === BLOCK) {
      return { done: true, offset: y + 0 };
    }
  }

  for (let i = 1; i <= 7; i++) {
    if (prevLastBlockRow && lastChamberRow[i] === BLOCK && prevLastBlockRow[i] === BLOCK) {
      return { done: true, offset: y + 1 };
    }
  }

  return { done: false };
};

const part1 = (input) => {
  const directions = input[0].split("");
  const shapesGenerator = cycle(SHAPES);
  const flowGenerator = cycle(directions);

  const chamber = [new Array(9).fill(BLOCK)];

  for (let i = 0; i < 3; i++) {
    simulateFall(chamber, shapesGenerator.next().value, flowGenerator);
  }

  // printChamber(chamber);
};

const part2 = (input) => {};

const example = await readLines(`./day_${DAY}/example.txt`);
const input = await readLines(`./day_${DAY}/input.txt`);

try {
  equal(await part1(example), 3068);
  equal(await part1(input), +Infinity);

  equal(await part2(example), +Infinity);
  equal(await part2(input), +Infinity);

  console.log(`Day ${DAY} completed ✔️`);
} catch (e) {
  console.log(`Day ${DAY} failed 𝗫 - ${e.message}`);
}
