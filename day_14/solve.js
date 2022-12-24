import { equal } from "node:assert";
import * as R from "ramda";
import { readLines } from "../helpers.js";

const DAY = `14`;

const EMPTY = ".";
const OCCUPIED = "#";

const drawMap = (map) => {
  const minX = Math.min(...R.filter(R.lt(0), R.map(R.findIndex(R.equals(OCCUPIED)), map)));
  const maxX = Math.min(...R.filter(R.lt(0), R.map(R.findLastIndex(R.equals(OCCUPIED)), map)));
  const width = maxX - minX + 2;
  const height = map.length;

  const display = Array.from({ length: height }, () => new Array(width).fill(EMPTY));

  // Offset everything to only visible elements so it fits into the screen
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < map[y].length; x++) {
      if (map[y][x]) {
        display[y][x - minX] = map[y][x];
      }
    }
  }

  console.log(display.map((l) => l.join("")).join("\n"));
  console.log("0o33[H");
};

const parseInput = (input) =>
  input.map((line) =>
    line.split(" -> ").map((l) => {
      const [x, y] = l.split(",").map((v) => parseInt(v, 10));
      return { x, y };
    })
  );

const generateMap = (coords, withFloor) => {
  const maxX = Math.max(...R.pluck("x", coords.flat()));
  const maxY = Math.max(...R.pluck("y", coords.flat()));
  const height = withFloor ? maxY + 1 + 2 : maxY + 1;
  const width = withFloor ? maxX + height : maxX + 1;

  const map = Array.from({ length: height }, () => new Array(width).fill(EMPTY));

  for (const line of coords) {
    const moves = R.aperture(2, line);

    for (const [start, end] of moves) {
      if (start.x === end.x) {
        // move vertically
        const [m, n] = R.sort(R.subtract, [start.y, end.y]);
        R.forEach((y) => {
          map[y][start.x] = OCCUPIED;
        }, R.range(m, n + 1));
      } else {
        // move horizontally
        const [m, n] = R.sort(R.subtract, [start.x, end.x]);
        R.forEach((x) => {
          map[start.y][x] = OCCUPIED;
        }, R.range(m, n + 1));
      }
    }
  }

  if (withFloor) {
    const floor = R.last(map);
    for (let i in floor) {
      floor[i] = OCCUPIED;
    }
  }

  return map;
};

const settle = (map, x, y) => {
  if (y >= map.length - 1) {
    return true;
  }

  if (x <= 0 || x >= map[0].length - 1) {
    return true;
  }

  if (map[y + 1][x] !== OCCUPIED) {
    return settle(map, x, y + 1);
  }

  if (map[y + 1][x - 1] === OCCUPIED && map[y + 1][x + 1] === OCCUPIED) {
    map[y][x] = OCCUPIED;
    return false;
  }

  if (map[y + 1][x - 1] !== OCCUPIED) {
    return settle(map, x - 1, y + 1);
  }

  if (map[y + 1][x + 1] !== OCCUPIED) {
    return settle(map, x + 1, y + 1);
  }
};

const part1 = (input) => {
  const state = {
    map: generateMap(parseInput(input)),
    done: false,
    grains: 0,
  };

  while (!state.done) {
    state.done = settle(state.map, 500, 0);
    if (!state.done) {
      state.grains += 1;
    }
    // drawMap(state.map);
  }

  return state.grains;
};

export const part2 = (input) => {
  const state = {
    map: generateMap(parseInput(input), true),
    done: false,
    grains: 0,
  };

  while (!state.done) {
    settle(state.map, 500, 0);
    state.grains += 1;
    if (state.map[0][500] === OCCUPIED) {
      state.done = true;
    }
    // drawMap(state.map);
  }
  return state.grains;
};

const example = await readLines(`./day_${DAY}/example.txt`);
const input = await readLines(`./day_${DAY}/input.txt`);

try {
  equal(await part1(example), 24);
  equal(await part1(input), 793);

  equal(await part2(example), 93);
  equal(await part2(input), 24166);

  console.log(`Day ${DAY} completed ✔️`);
} catch (e) {
  console.log(`Day ${DAY} failed 𝗫 - ${e.message}`);
}
