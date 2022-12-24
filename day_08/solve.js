import { equal } from "node:assert";
import * as R from "ramda";
import { readLines } from "../helpers.js";

const DAY = `08`;

const parseTrees = R.map(
  R.pipe(
    R.split(""),
    R.map((v) => parseInt(v, 10))
  )
);

const incWhileSmaller = (limit) => (acc, value) => value >= limit ? R.reduced(R.inc(acc)) : R.inc(acc);

const isTreeVisible = (trees, row, col) =>
  R.any(R.all(R.gt(trees[row][col])))([
    R.take(col, trees[row]), // left
    R.drop(col + 1, trees[row]), // right
    R.take(row, trees).flatMap(R.nth(col)), // up
    R.drop(row + 1, trees).flatMap(R.nth(col)), // down
  ]);

const getTreeScenicScore = (trees, row, col) =>
  R.pipe(
    R.map(R.reduce(incWhileSmaller(trees[row][col]), 0)),
    R.reduce(R.multiply, 1)
  )([
    R.reverse(R.take(col, trees[row])), // left
    R.drop(col + 1, trees[row]), // right
    R.reverse(R.take(row, trees).flatMap(R.nth(col))), // up
    R.drop(row + 1, trees).flatMap(R.nth(col)), // down
  ]);

const part1 = (input) => {
  const trees = parseTrees(input);
  let visibleTrees = input.length * 2 + (input[0].length - 2) * 2; // initial edges

  for (let i = 1; i < input.length - 1; i++) {
    for (let j = 1; j < input[0].length - 1; j++) {
      if (isTreeVisible(trees, i, j)) {
        visibleTrees += 1;
      }
    }
  }

  return visibleTrees;
};

const part2 = (input) => {
  const trees = parseTrees(input);
  let scenicScores = [];

  for (let i = 1; i < input.length - 1; i++) {
    for (let j = 1; j < input[0].length - 1; j++) {
      scenicScores.push(getTreeScenicScore(trees, i, j));
    }
  }

  return R.head(R.sort((a, b) => b - a, scenicScores));
};

const example = await readLines(`./day_${DAY}/example.txt`);
const input = await readLines(`./day_${DAY}/input.txt`);

try {
  equal(await part1(example), 21);
  equal(await part1(input), 1679);

  equal(await part2(example), 8);
  equal(await part2(input), 536625);

  console.log(`Day ${DAY} completed ✔️`);
} catch (e) {
  console.log(`Day ${DAY} failed 𝗫 - ${e.message}`);
}
