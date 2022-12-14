import { equal } from "node:assert";
import * as R from "ramda";
import { readLines } from "../helpers.js";

const DAY = `02`;

const ROCK = "rock";
const PAPER = "paper";
const SCISSORS = "scissors";

// [shape]: [beats, loses, score]
const rules = {
  [ROCK]: [SCISSORS, PAPER, 1],
  [PAPER]: [ROCK, SCISSORS, 2],
  [SCISSORS]: [PAPER, ROCK, 3],
};

const getShape = (v) => {
  if (["A", "X"].includes(v)) return ROCK;
  if (["B", "Y"].includes(v)) return PAPER;
  if (["C", "Z"].includes(v)) return SCISSORS;
};

const getRoundResult = (left, right) => {
  if (left === right) return 3; // draw
  if (right === rules[left][0]) return 0; // lost
  return 6; // won
};

const findRightHand = (left, result) => {
  if (result === "Y") return left; // draw
  if (result === "X") return rules[left][0]; // lose
  if (result === "Z") return rules[left][1]; // win
};

const part1 = R.pipe(
  R.map((round) => {
    let [left, right] = round.split(" ").map(getShape);
    return rules[right][2] + getRoundResult(left, right);
  }),
  R.sum
);

const part2 = R.pipe(
  R.map((round) => {
    let [left, fixedResult] = round.split(" ");
    const right = findRightHand(getShape(left), fixedResult);
    return rules[right][2] + getRoundResult(getShape(left), right);
  }),
  R.sum
);

const example = await readLines(`./day_${DAY}/example.txt`);
const input = await readLines(`./day_${DAY}/input.txt`);

try {
  equal(await part1(example), 15);
  equal(await part1(input), 15572);

  equal(await part2(example), 12);
  equal(await part2(input), 16098);

  console.log(`Day ${DAY} completed ✔️`);
} catch (e) {
  console.log(`Day ${DAY} failed 𝗫 - ${e.message}`);
}
