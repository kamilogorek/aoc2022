import { equal } from "node:assert";
import * as R from "ramda";
import { readLines } from "../helpers.js";

const DAY = `10`;

const CHECK_STATES = [20, 60, 100, 140, 180, 220];
const PIXELS = [-1, 0, 1];
const ROW_WIDTH = 40;
const CYCLES = {
  noop: 1,
  addx: 2,
};

const parseInstructions = (input) =>
  input.map((v) => {
    const [instruction, value] = v.split(" ");
    return value ? [instruction, parseInt(value, 10)] : [instruction];
  });

const collectStates = (instructions, producer) =>
  R.reduce(
    (acc, instruction) => {
      const [cmd, val] = instruction;

      R.times(() => {
        acc.states.push(producer(acc.register));
      }, CYCLES[cmd]);

      if (cmd === "addx") {
        acc.register += val;
      }

      return acc;
    },
    { register: 1, states: [] },
    instructions
  ).states;

const registerToPixels = (register) => PIXELS.map((pixel) => register + pixel);

const part1 = (input) => {
  // `1` is the initial state of the registry
  const states = [1, ...collectStates(parseInstructions(input), R.identity)];
  return R.reduce((acc, idx) => (acc += idx * states[idx]), 0, CHECK_STATES);
};

const part2 = (input) => {
  const states = collectStates(parseInstructions(input), registerToPixels);
  return R.pipe(
    R.addIndex(R.reduce)((acc, state, index) => (acc += state.includes(index % ROW_WIDTH) ? "#" : "."), ""),
    R.splitEvery(ROW_WIDTH),
    R.join("\n")
  )(states);
};

const example = await readLines(`./day_${DAY}/example.txt`);
const input = await readLines(`./day_${DAY}/input.txt`);

equal(await part1(example), 13140);
equal(await part1(input), 12560);

equal(
  await part2(example),
  `
##..##..##..##..##..##..##..##..##..##..
###...###...###...###...###...###...###.
####....####....####....####....####....
#####.....#####.....#####.....#####.....
######......######......######......####
#######.......#######.......#######.....
`.trim()
);
equal(
  await part2(input),
  `
###..#....###...##..####.###...##..#....
#..#.#....#..#.#..#.#....#..#.#..#.#....
#..#.#....#..#.#..#.###..###..#....#....
###..#....###..####.#....#..#.#....#....
#....#....#....#..#.#....#..#.#..#.#....
#....####.#....#..#.#....###...##..####.
`.trim()
);

console.log(`Day ${DAY} completed ✔️`);
