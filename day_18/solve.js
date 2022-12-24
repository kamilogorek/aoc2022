import { equal } from "node:assert";
import * as R from "ramda";
import { readLines } from "../helpers.js";

const DAY = `18`;

const coordsToKey = (x, y, z) => `${x},${y},${z}`;

class Cube {
  constructor(x, y, z) {
    this.key = coordsToKey(x, y, z);
    this.visibleSides = {
      [coordsToKey(x + 1, y, z)]: true, // right
      [coordsToKey(x - 1, y, z)]: true, // left
      [coordsToKey(x, y + 1, z)]: true, // front
      [coordsToKey(x, y - 1, z)]: true, // back
      [coordsToKey(x, y, z + 1)]: true, // top
      [coordsToKey(x, y, z - 1)]: true, // bottom
    };
  }

  collectVisible() {
    return Object.values(this.visibleSides).filter(Boolean).length;
  }

  markSide(cube) {
    this.visibleSides[cube.key] = false;
  }
}

const parseInput = (input) =>
  input.map((l) => {
    const [x, y, z] = l.split(",").map((v) => parseInt(v, 10));
    return new Cube(x, y, z);
  });

const part1 = (input) => {
  const droplets = parseInput(input);

  for (const firstDroplet of droplets) {
    for (const secondDroplet of droplets) {
      firstDroplet.markSide(secondDroplet);
      secondDroplet.markSide(firstDroplet);
    }
  }

  return R.sum(droplets.map((droplet) => droplet.collectVisible()));
};

const part2 = (input) => {};

const example = await readLines(`./day_${DAY}/example.txt`);
const input = await readLines(`./day_${DAY}/input.txt`);

try {
  equal(await part1(example), 64);
  equal(await part1(input), 4364);

  // equal(await part2(example), +Infinity);
  // equal(await part2(input), +Infinity);

  console.log(`Day ${DAY} completed ✔️`);
} catch (e) {
  console.log(`Day ${DAY} failed 𝗫 - ${e.message}`);
}
