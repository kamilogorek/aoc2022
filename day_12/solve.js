import { equal } from "node:assert";
import * as R from "ramda";
import { readLines } from "../helpers.js";
import Graph from "node-dijkstra";

const DAY = `12`;

const DIRS = [
  [1, 0],
  [-1, 0],
  [0, -1],
  [0, 1],
];

// "S" === 83 === 0
// [a-z] % 96 === [1-26]
// "E" === 69 === 27
const parseMap = (input) =>
  input.map((v) =>
    v.split("").map((v) => {
      const cp = v.codePointAt(0);
      if (cp === 83) return 0;
      if (cp === 69) return 27;
      return cp % 96;
    })
  );

const makeGraph = (map) => {
  const graph = new Graph();

  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
      const node = DIRS.reduce((acc, [dx, dy]) => {
        const nextX = x + dx;
        const nextY = y + dy;
        const outOfBounds = nextX < 0 || nextX >= map[y].length || nextY < 0 || nextY >= map.length;

        if (outOfBounds) {
          return acc;
        }

        if (map[nextY][nextX] - map[y][x] <= 1) {
          // All nodes have weight=1
          acc[`${nextX},${nextY}`] = 1;
        }

        return acc;
      }, {});

      graph.addNode(`${x},${y}`, node);
    }
  }

  return graph;
};

const findPositions = (map, val) => {
  const cands = [];
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[0].length; x++) {
      if (map[y][x] === val) {
        cands.push(`${x},${y}`);
      }
    }
  }
  return cands;
};

const solve = (input, startValue) => {
  const map = parseMap(input);
  const graph = makeGraph(map);
  const end = R.head(findPositions(map, 27));

  return R.pipe(
    R.partial(findPositions, [map]),
    R.map((start) => graph.path(start, end, { cost: true }).cost),
    R.filter(R.lt(0)),
    R.sort((a, b) => a - b),
    R.head
  )(startValue);
};

const part1 = (input) => solve(input, 0);
const part2 = (input) => solve(input, 1);

const example = await readLines(`./day_${DAY}/example.txt`);
const input = await readLines(`./day_${DAY}/input.txt`);

try {
  equal(await part1(example), 31);
  equal(await part1(input), 408);

  equal(await part2(example), 29);
  equal(await part2(input), 399);

  console.log(`Day ${DAY} completed ✔️`);
} catch (e) {
  console.log(`Day ${DAY} failed 𝗫 - ${e.message}`);
}
