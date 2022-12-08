import { equal } from "node:assert";
import * as R from "ramda";
import { readLines } from "../helpers.js";

const DAY = `08`;

const isVisible = (trees, row, col) => {
  const height = trees[row][col];
  const left = trees[row].slice(0, col).every((val) => val < height);
  const right = trees[row].slice(col + 1).every((val) => val < height);
  const up = trees
    .slice(0, row)
    .reduce((acc, r) => [...acc, r[col]], [])
    .every((val) => val < height);
  const down = trees
    .slice(row + 1)
    .reduce((acc, r) => [...acc, r[col]], [])
    .every((val) => val < height);
  return left || right || up || down;
};

const getScenicScore = (trees, row, col) => {
  const height = trees[row][col];

  let leftScore = 0;
  trees[row]
    .slice(0, col)
    .reverse()
    .some((value) => {
      leftScore++;
      return value >= height;
    });

  let rightScore = 0;
  trees[row].slice(col + 1).some((value) => {
    rightScore++;
    return value >= height;
  });

  let upScore = 0;
  trees
    .slice(0, row)
    .reduce((acc, r) => [...acc, r[col]], [])
    .reverse()
    .some((value) => {
      upScore++;
      return value >= height;
    });

  let downScore = 0;
  trees
    .slice(row + 1)
    .reduce((acc, r) => [...acc, r[col]], [])
    .some((value) => {
      downScore++;
      return value >= height;
    });

  return leftScore * upScore * rightScore * downScore;
};

const part1 = (input) => {
  const trees = input.map((v) => v.split("").map((v) => parseInt(v, 10)));
  let visibleTrees = input.length * 2 + (input[0].length - 2) * 2;

  for (let i = 1; i < input.length - 1; i++) {
    for (let j = 1; j < input[0].length - 1; j++) {
      if (isVisible(trees, i, j)) {
        visibleTrees += 1;
      }
    }
  }

  return visibleTrees;
};

const part2 = (input) => {
  const trees = input.map((v) => v.split("").map((v) => parseInt(v, 10)));
  let scenicScores = [];

  for (let i = 1; i < input.length - 1; i++) {
    for (let j = 1; j < input[0].length - 1; j++) {
      scenicScores.push(getScenicScore(trees, i, j));
    }
  }

  return scenicScores.sort((a, b) => b - a)[0]
};

const example = await readLines(`./day_${DAY}/example.txt`);
const input = await readLines(`./day_${DAY}/input.txt`);

equal(await part1(example), 21);
equal(await part1(input), 1679);

equal(await part2(example), 8);
equal(await part2(input), 536625);

console.log(`Day ${DAY} completed ✔️`);
