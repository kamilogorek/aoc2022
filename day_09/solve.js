import { equal } from "node:assert";
import * as R from "ramda";
import { readLines } from "../helpers.js";

const DAY = `09`;

const DIRS = {
  R: { x: 1, y: 0 },
  L: { x: -1, y: 0 },
  U: { x: 0, y: -1 },
  D: { x: 0, y: 1 },
};

const SHIFT = 20;

const drawRope = (rope) => {
  const matrix = [];
  const max = Math.max(...rope.map((v) => v.x + SHIFT + 1));

  rope.forEach((part) => {
    matrix[part.y + SHIFT] = matrix[part.y + SHIFT] || [];
    matrix[part.y + SHIFT][part.x + SHIFT] = "X";
  });

  matrix.forEach((x) => {
    for (let i = 0; i < max; i++) {
      x[i] = x[i] || ".";
    }
  });
};

const move = (dir, rope) => {
  rope[0].x += DIRS[dir].x;
  rope[0].y += DIRS[dir].y;

  for (let i = 0; i < rope.length - 1; i++) {
    if (!endsTouching(rope[i], rope[i + 1])) {
      moveTail(dir, rope[i], rope[i + 1]);
    }
  }
};

const moveTail = (dir, head, tail) => {
  switch (dir) {
    case "R": {
      tail.x = head.x - 1;
      tail.y = head.y;
      break;
    }
    case "L": {
      tail.x = head.x + 1;
      tail.y = head.y;
      break;
    }
    case "U": {
      tail.x = head.x;
      tail.y = head.y + 1;
      break;
    }
    case "D": {
      tail.x = head.x;
      tail.y = head.y - 1;
      break;
    }
  }
};

const endsTouching = (a, b) => {
  return b.x >= a.x - 1 && b.x <= a.x + 1 && b.y >= a.y - 1 && b.y <= a.y + 1;
};

const part1 = (input) => {
  const rope = Array.from({ length: 2 }, () => ({ x: 0, y: 0 }));
  const visited = new Set();
  const moves = input.map((v) => v.split(" "));

  for (const [dir, distance] of moves) {
    R.times(() => {
      move(dir, rope);
      const tail = R.last(rope);
      visited.add(`${tail.x},${tail.y}`);
    }, parseInt(distance, 10));
  }

  return visited.size;
};

const part2 = (input) => {
  const rope = Array.from({ length: 10 }, () => ({ x: 0, y: 0 }));
  const visited = new Set();
  const moves = input.map((v) => v.split(" "));

  for (const [dir, distance] of moves) {
    R.times(() => {
      move(dir, rope);
      const tail = R.last(rope);
      visited.add(`${tail.x},${tail.y}`);
    }, parseInt(distance, 10));
  }

  return visited.size;
};

const example = await readLines(`./day_${DAY}/example.txt`);
const example2 = await readLines(`./day_${DAY}/example_2.txt`);
const input = await readLines(`./day_${DAY}/input.txt`);

equal(await part1(example), 13);
equal(await part1(input), 6498);

// equal(await part2(example), 1);
// equal(await part2(example2), 36);
// equal(await part2(input), +Infinity);

console.log(`Day ${DAY} completed ✔️`);
