import { equal } from "node:assert";
import * as R from "ramda";
import { readGroupedLines } from "../helpers.js";

const DAY = `05`;

const getTopCrates = R.pipe(R.map(R.last), R.join(""));

const parseStacks = (input) => {
  const stacks = [];

  for (const row of R.reverse(R.dropLast(1, input))) {
    R.pipe(
      R.toPairs,
      R.filter(([_, letter]) => letter >= "A" && letter <= "Z"),
      R.forEach(([i, letter]) => {
        const idx = (i - 1) / 4;
        stacks[idx] = (stacks[idx] || []).concat(letter);
      })
    )(row);
  }

  return stacks;
};

const parseProcedure = (input) =>
  input.map((l) => {
    const [, n, , from, , to] = l.split(" ");
    return { n, from: from - 1, to: to - 1 };
  });

const part1 = (input) => {
  const stacks = parseStacks(input[0]);
  const procedure = parseProcedure(input[1]);

  for (const instruction of procedure) {
    R.times(() => {
      const { from, to } = instruction;
      stacks[to].push(stacks[from].pop());
    }, instruction.n);
  }

  return getTopCrates(stacks);
};

const part2 = (input) => {
  const stacks = parseStacks(input[0]);
  const procedure = parseProcedure(input[1]);

  for (const instruction of procedure) {
    const { n, from, to } = instruction;
    stacks[to] = stacks[to].concat(stacks[from].slice(-n));
    stacks[from] = stacks[from].slice(0, -n);
  }

  return getTopCrates(stacks);
};

const example = await readGroupedLines(`./day_${DAY}/example.txt`);
const input = await readGroupedLines(`./day_${DAY}/input.txt`);

try {
  equal(await part1(example), "CMZ");
  equal(await part1(input), "ZRLJGSCTR");

  equal(await part2(example), "MCD");
  equal(await part2(input), "PRTTGRFPB");

  console.log(`Day ${DAY} completed ✔️`);
} catch (e) {
  console.log(`Day ${DAY} failed 𝗫 - ${e.message}`);
}
