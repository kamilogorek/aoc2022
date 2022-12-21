import { evaluate, simplify } from "mathjs";
import { equal } from "node:assert";
import { readLines } from "../helpers.js";

const DAY = `21`;

class Monkeys {
  constructor(input, checkForEquality = false) {
    this.members = Object.fromEntries(
      input.map((l) => {
        let [name, lhs, sign, rhs] = l.split(" ");
        name = name.slice(0, -1);
        return [
          name,
          () => {
            if (checkForEquality) {
              if (name === "humn") return name;
              if (name === "root") return `${this.members[lhs]()} == ${this.members[rhs]()}`;
            }
            return /^\d+$/.test(lhs) ? lhs : `(${this.members[lhs]()} ${sign} ${this.members[rhs]()})`;
          },
        ];
      })
    );
  }
}

const part1 = (input) => {
  const monkeys = new Monkeys(input);
  return evaluate(monkeys.members["root"]());
};

const part2 = (input) => {
  // TODO: Use z3-solver, as `simplify` itself is not fast enough, and 8_600_000 is 100_000x too small.
  const monkeys = new Monkeys(input, true);
  let humn = 0;
  // Simplification takes a while
  const simplified = simplify(monkeys.members["root"]()).compile();
  while (!simplified.evaluate({ humn })) {
    if (humn !== 0 && humn % 100_000 === 0) {
      console.log(humn);
    }
    humn += 1;
  }
  return humn;
};

const example = await readLines(`./day_${DAY}/example.txt`);
const input = await readLines(`./day_${DAY}/input.txt`);

equal(await part1(example), 152);
equal(await part1(input), 93_813_115_694_560);

equal(await part2(example), 301);
equal(await part2(input), +Infinity);

console.log(`Day ${DAY} completed ✔️`);
