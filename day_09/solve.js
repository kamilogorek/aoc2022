import { equal } from "node:assert";
import * as R from "ramda";
import { readLines } from "../helpers.js";

const DAY = `09`;

const DRAWING_PADDING = 5;

const drawRope = (rope) => {
  const minX = Math.min(...R.pluck("x", rope));
  const maxX = Math.max(...R.pluck("x", rope));
  const minY = Math.min(...R.pluck("y", rope));
  const maxY = Math.max(...R.pluck("y", rope));

  const width = maxX - minX + DRAWING_PADDING * 2;
  const height = maxY - minY + DRAWING_PADDING * 2;

  const display = Array.from({ length: height }, () => new Array(width).fill("."));

  for (let i = 0; i < rope.length; i++) {
    const x = rope[i].x - minX + DRAWING_PADDING;
    const y = rope[i].y - minY + DRAWING_PADDING;
    if (display[y][x] !== ".") {
      continue;
    }

    if (i === 0) {
      display[y][x] = "H";
    } else if (i === rope.length - 1) {
      display[y][x] = "T";
    } else {
      display[y][x] = `${i}`;
    }
  }

  for (const row of display) {
    console.log(row.join(""));
  }

  console.log("");
};

const DIRS = {
  R: { x: 1, y: 0 },
  L: { x: -1, y: 0 },
  U: { x: 0, y: -1 },
  D: { x: 0, y: 1 },
};

const segmentsTouching = (current, next) => {
  return Math.abs(current.x - next.x) <= 1 && Math.abs(current.y - next.y) <= 1;
};

const getPositionDiff = (current, next) => ({
  x: R.clamp(-1, 1, current.x - next.x),
  y: R.clamp(-1, 1, current.y - next.y),
});

const moveRope = (dir, rope) => {
  rope[0].x += DIRS[dir].x;
  rope[0].y += DIRS[dir].y;

  for (const [current, next] of R.aperture(2, rope)) {
    if (segmentsTouching(current, next)) {
      return;
    }

    const { x, y } = getPositionDiff(current, next);
    next.x += x;
    next.y += y;
  }
};

const solveForLength = (ropeLength, input) => {
  const rope = Array.from({ length: ropeLength }, () => ({ x: 0, y: 0 }));
  const visited = new Set();
  const moves = input.map((v) => {
    const [dir, distance] = v.split(" ");
    return [dir, parseInt(distance, 10)];
  });

  for (const [dir, distance] of moves) {
    R.times(() => {
      moveRope(dir, rope);
      visited.add(`${R.last(rope).x},${R.last(rope).y}`);
    }, distance);
  }

  return visited.size;
};

const part1 = (input) => solveForLength(2, input);
const part2 = (input) => solveForLength(10, input);

const example = await readLines(`./day_${DAY}/example.txt`);
const example2 = await readLines(`./day_${DAY}/example_2.txt`);
const input = await readLines(`./day_${DAY}/input.txt`);

equal(await part1(example), 13);
equal(await part1(input), 6498);

equal(await part2(example), 1);
equal(await part2(example2), 36);
equal(await part2(input), 2531);

console.log(`Day ${DAY} completed ✔️`);
