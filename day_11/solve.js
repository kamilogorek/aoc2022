import { equal } from "node:assert";
import * as R from "ramda";
import { readGroupedLines } from "../helpers.js";

const DAY = `11`;

const getNumberFromStr = (input) => parseInt(input.match(/(\d+)/), 10);

const parseMonkey = (input) => {
  const [, opSign, opValue] = input[2].match(/Operation: new = old (.) (\d+|old)/);
  return {
    items: Array.from(input[1].matchAll(/(\d+)/g)).map((v) => parseInt(v, 10)),
    opSign,
    opValue: opValue === "old" ? "old" : parseInt(opValue, 10),
    test: getNumberFromStr(input[3]),
    ifTrue: getNumberFromStr(input[4]),
    ifFalse: getNumberFromStr(input[5]),
  };
};

const playRound = (monkeys, attempts, factorial) => {
  for (const [i, monkey] of Object.entries(monkeys)) {
    let item = monkey.items.shift();
    while (item) {
      attempts[i] += 1;

      let newItem;

      if (monkey.opValue === "old") {
        newItem = item * item;
      } else if (monkey.opSign === "+") {
        newItem = item + monkey.opValue;
      } else if (monkey.opSign === "*") {
        newItem = item * monkey.opValue;
      }

      newItem = factorial ? newItem % factorial : Math.floor(newItem / 3);

      monkeys[newItem % monkey.test === 0 ? monkey.ifTrue : monkey.ifFalse].items.push(newItem);
      item = monkey.items.shift();
    }
  }
};

const solve = (input, rounds, useFact) => {
  const monkeys = input.map(parseMonkey);
  const attempts = new Array(monkeys.length).fill(0);

  if (useFact) {
    const factorial = R.product(R.pluck("test", monkeys));
    R.times(() => playRound(monkeys, attempts, factorial), rounds);
  } else {
    R.times(() => playRound(monkeys, attempts), rounds);
  }

  attempts.sort((a, b) => b - a);
  return attempts[0] * attempts[1];
};

const part1 = (input) => solve(input, 20, false);
const part2 = (input) => solve(input, 10000, true);

const example = await readGroupedLines(`./day_${DAY}/example.txt`);
const input = await readGroupedLines(`./day_${DAY}/input.txt`);

try {
  equal(await part1(example), 10605);
  equal(await part1(input), 64032);

  equal(await part2(example), 2713310158);
  equal(await part2(input), 12729522272);

  console.log(`Day ${DAY} completed ✔️`);
} catch (e) {
  console.log(`Day ${DAY} failed 𝗫 - ${e.message}`);
}
