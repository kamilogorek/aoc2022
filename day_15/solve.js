import { equal } from "node:assert";
import * as R from "ramda";
import { readLines } from "../helpers.js";

const DAY = `15`;

const parseInput = (input) => {
  return input.map((line) => {
    let [_, sx, sy, bx, by] = line.match(/Sensor at x=(-?\d+), y=(-?\d+): closest beacon is at x=(-?\d+), y=(-?\d+)/);

    sx = parseInt(sx, 10);
    sy = parseInt(sy, 10);
    bx = parseInt(bx, 10);
    by = parseInt(by, 10);

    return {
      sensor: {
        x: sx,
        y: sy,
      },
      beacon: {
        x: bx,
        y: by,
      },
      distance: Math.abs(sx - bx) + Math.abs(sy - by),
    };
  });
};

const serializeCorods = ({ x, y }) => `${x},${y}`;

const cannotContainBeaconAt = (report, row) => {
  const beacons = new Set();
  const locations = new Set();

  report.forEach((coord) => {
    if (coord.beacon.y === row) {
      beacons.add(serializeCorods(coord.beacon));
    }
  });

  report.forEach((coord) => {
    const { x, y } = coord.sensor;
    const capY = Math.abs(y - row);

    for (let dx = coord.distance - capY; dx >= 0; dx--) {
      locations.add(serializeCorods({ x: x + dx, y: row }));
      locations.add(serializeCorods({ x: x - dx, y: row }));
    }
  });

  return locations.size - beacons.size;
};

const part1 = (input, row) => cannotContainBeaconAt(parseInput(input), row);
const part2 = (input) => {};

const example = await readLines(`./day_${DAY}/example.txt`);
const input = await readLines(`./day_${DAY}/input.txt`);

equal(await part1(example, 10), 26);
equal(await part1(input, 2000000), 5108096);

// equal(await part2(example), +Infinity);
// equal(await part2(input), +Infinity);

console.log(`Day ${DAY} completed ✔️`);
